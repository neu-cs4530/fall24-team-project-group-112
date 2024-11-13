import { ObjectId } from 'mongodb';
import { QueryOptions } from 'mongoose';
import {
  Answer,
  AnswerResponse,
  Comment,
  CommentResponse,
  Notification,
  NotificationType,
  Follow,
  FollowResponse,
  OrderType,
  Question,
  QuestionResponse,
  Tag,
  UpdateUserPayload,
  User,
  UserResponse,
} from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import TagModel from './tags';
import CommentModel from './comments';
import NotificationModel from './notifications';
import UserModel from './users';
import FollowModel from './follows';

/**
 * Parses tags from a search string.
 *
 * @param {string} search - Search string containing tags in square brackets (e.g., "[tag1][tag2]")
 *
 * @returns {string[]} - An array of tags found in the search string
 */
const parseTags = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing tags and extracting individual words.
 *
 * @param {string} search - The search string containing keywords and possibly tags
 *
 * @returns {string[]} - An array of keywords found in the search string
 */
const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 *
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
const checkTagInQuestion = (q: Question, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if any keywords in the provided list exist in a given question's title or text.
 *
 * @param {Question} q - The question to check
 * @param {string[]} keywordlist - The list of keywords to check for
 *
 * @returns {boolean} - `true` if any keyword is present, `false` otherwise.
 */
const checkKeywordInQuestion = (q: Question, keywordlist: string[]): boolean => {
  for (const w of keywordlist) {
    if (q.title.includes(w) || q.text.includes(w)) {
      return true;
    }
  }

  return false;
};

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to sort
 *
 * @returns {Question[]} - The sorted list of questions
 */
const sortQuestionsByNewest = (qlist: Question[]): Question[] =>
  qlist.sort((a, b) => {
    if (a.askDateTime > b.askDateTime) {
      return -1;
    }

    if (a.askDateTime < b.askDateTime) {
      return 1;
    }

    return 0;
  });

/**
 * Gets unanswered questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of unanswered questions
 */
const sortQuestionsByUnanswered = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).filter(q => q.answers.length === 0);

/**
 * Records the most recent answer time for a question.
 *
 * @param {Question} question - The question to check
 * @param {Map<string, Date>} mp - A map of the most recent answer time for each question
 */
const getMostRecentAnswerTime = (question: Question, mp: Map<string, Date>): void => {
  // This is a private function and we can assume that the answers field is not undefined or an array of ObjectId
  const answers = question.answers as Answer[];
  answers.forEach((answer: Answer) => {
    if (question._id !== undefined) {
      const currentMostRecent = mp.get(question?._id.toString());
      if (!currentMostRecent || currentMostRecent < answer.ansDateTime) {
        mp.set(question._id.toString(), answer.ansDateTime);
      }
    }
  });
};

/**
 * Gets active questions from a list, sorted by the most recent answer date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of active questions
 */
const sortQuestionsByActive = (qlist: Question[]): Question[] => {
  const mp = new Map();
  qlist.forEach(q => {
    getMostRecentAnswerTime(q, mp);
  });

  return sortQuestionsByNewest(qlist).sort((a, b) => {
    const adate = mp.get(a._id?.toString());
    const bdate = mp.get(b._id?.toString());
    if (!adate) {
      return 1;
    }
    if (!bdate) {
      return -1;
    }
    if (adate > bdate) {
      return -1;
    }
    if (adate < bdate) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts a list of questions by the number of views in descending order. First, the questions are
 * sorted by creation date (newest first), then by number of views, from highest to lowest.
 * If questions have the same number of views, the newer question will be before the older question.
 *
 * @param qlist The array of Question objects to be sorted.
 *
 * @returns A new array of Question objects sorted by the number of views.
 */
const sortQuestionsByMostViews = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).sort((a, b) => b.views.length - a.views.length);

/**
 * Adds a tag to the database if it does not already exist.
 *
 * @param {Tag} tag - The tag to add
 *
 * @returns {Promise<Tag | null>} - The added or existing tag, or `null` if an error occurred
 */
export const addTag = async (tag: Tag): Promise<Tag | null> => {
  try {
    // Check if a tag with the given name already exists
    const existingTag = await TagModel.findOne({ name: tag.name });

    if (existingTag) {
      return existingTag as Tag;
    }

    // If the tag does not exist, create a new one
    const newTag = new TagModel(tag);
    const savedTag = await newTag.save();

    return savedTag as Tag;
  } catch (error) {
    return null;
  }
};

/**
 * Adds a notification to the database for the given event and user.
 * @param {ObjectId} eventId id of event associated with this notification
 * @param {string} receiverUsername username of user who will receive this notification
 * @param {NotificationType} type type of event associated with this notification
 * @returns {Promise<Notification | { error: string }>} - The added notification or an error message
 */
const addNotifications = async (
  eventId: ObjectId,
  receiverUsername: string,
  type: NotificationType,
): Promise<Notification | { error: string }> => {
  try {
    if (!eventId || !type || !receiverUsername) {
      throw new Error('Invalid request');
    }

    console.log('Adding notification for event:', eventId, 'to user:', receiverUsername);

    /* TODO: Once getFollowers endpoint is implemented, retrieve the followers of the user 
    who performed the action and create a notification record for each of them. */

    const notif: Notification = {
      notificationType: type,
      eventId,
      receiverUsername,
      notificationDate: new Date(),
      seen: false,
    };

    return await NotificationModel.create(notif);
  } catch (error) {
    return { error: `Error when adding notification: ${(error as Error).message}` };
  }
};

/**
 * Retrieves questions from the database, ordered by the specified criteria.
 *
 * @param {OrderType} order - The order type to filter the questions
 *
 * @returns {Promise<Question[]>} - Promise that resolves to a list of ordered questions
 */
export const getQuestionsByOrder = async (order: OrderType): Promise<Question[]> => {
  try {
    let qlist = [];
    if (order === 'active') {
      qlist = await QuestionModel.find().populate([
        { path: 'tags', model: TagModel },
        { path: 'answers', model: AnswerModel },
      ]);
      return sortQuestionsByActive(qlist);
    }
    qlist = await QuestionModel.find().populate([{ path: 'tags', model: TagModel }]);
    if (order === 'unanswered') {
      return sortQuestionsByUnanswered(qlist);
    }
    if (order === 'newest') {
      return sortQuestionsByNewest(qlist);
    }
    return sortQuestionsByMostViews(qlist);
  } catch (error) {
    return [];
  }
};

/**
 * Filters a list of questions by the user who asked them.
 *
 * @param qlist The array of Question objects to be filtered.
 * @param askedBy The username of the user who asked the questions.
 *
 * @returns Filtered Question objects.
 */
export const filterQuestionsByAskedBy = (qlist: Question[], askedBy: string): Question[] =>
  qlist.filter(q => q.askedBy === askedBy);

/**
 * Filters questions based on a search string containing tags and/or keywords.
 *
 * @param {Question[]} qlist - The list of questions to filter
 * @param {string} search - The search string containing tags and/or keywords
 *
 * @returns {Question[]} - The filtered list of questions matching the search criteria
 */
export const filterQuestionsBySearch = (qlist: Question[], search: string): Question[] => {
  const searchTags = parseTags(search);
  const searchKeyword = parseKeyword(search);

  if (!qlist || qlist.length === 0) {
    return [];
  }
  return qlist.filter((q: Question) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    }

    if (searchKeyword.length === 0) {
      return checkTagInQuestion(q, searchTags);
    }

    if (searchTags.length === 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    }

    return checkKeywordInQuestion(q, searchKeyword) || checkTagInQuestion(q, searchTags);
  });
};

/**
 * Fetches and populates a question or answer document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the question or answer to fetch.
 * @param {'question' | 'answer'} type - Specifies whether to fetch a question or an answer.
 *
 * @returns {Promise<QuestionResponse | AnswerResponse>} - Promise that resolves to the
 *          populated question or answer, or an error message if the operation fails
 */
export const populateDocument = async (
  id: string | undefined,
  type: 'question' | 'answer',
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!id) {
      throw new Error('Provided question ID is undefined.');
    }

    let result = null;

    if (type === 'question') {
      result = await QuestionModel.findOne({ _id: id }).populate([
        {
          path: 'tags',
          model: TagModel,
        },
        {
          path: 'answers',
          model: AnswerModel,
          populate: { path: 'comments', model: CommentModel },
        },
        { path: 'comments', model: CommentModel },
      ]);
    } else if (type === 'answer') {
      result = await AnswerModel.findOne({ _id: id }).populate([
        { path: 'comments', model: CommentModel },
      ]);
    }
    if (!result) {
      throw new Error(`Failed to fetch and populate a ${type}`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Fetches a question by its ID and increments its view count.
 *
 * @param {string} qid - The ID of the question to fetch.
 * @param {string} username - The username of the user requesting the question.
 *
 * @returns {Promise<QuestionResponse | null>} - Promise that resolves to the fetched question
 *          with incremented views, null if the question is not found, or an error message.
 */
export const fetchAndIncrementQuestionViewsById = async (
  qid: string,
  username: string,
): Promise<QuestionResponse | null> => {
  try {
    const q = await QuestionModel.findOneAndUpdate(
      { _id: new ObjectId(qid) },
      { $addToSet: { views: username } },
      { new: true },
    ).populate([
      {
        path: 'tags',
        model: TagModel,
      },
      {
        path: 'answers',
        model: AnswerModel,
        populate: { path: 'comments', model: CommentModel },
      },
      { path: 'comments', model: CommentModel },
    ]);
    return q;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Saves a new question to the database.
 *
 * @param {Question} question - The question to save
 *
 * @returns {Promise<QuestionResponse>} - The saved question, or error message
 */
export const saveQuestion = async (question: Question): Promise<QuestionResponse> => {
  try {
    const result = await QuestionModel.create(question);
    return result;
  } catch (error) {
    return { error: 'Error when saving a question' };
  }
};

/**
 * Saves a new answer to the database.
 *
 * @param {Answer} answer - The answer to save
 *
 * @returns {Promise<AnswerResponse>} - The saved answer, or an error message if the save failed
 */
export const saveAnswer = async (answer: Answer): Promise<AnswerResponse> => {
  try {
    const result = await AnswerModel.create(answer);

    return result;
  } catch (error) {
    throw error;
    // return { error: 'Error when saving an answer' };
  }
};

/**
 * Saves a new comment to the database.
 *
 * @param {Comment} comment - The comment to save
 *
 * @returns {Promise<CommentResponse>} - The saved comment, or an error message if the save failed
 */
export const saveComment = async (comment: Comment): Promise<CommentResponse> => {
  try {
    const result = await CommentModel.create(comment);
    return result;
  } catch (error) {
    return { error: 'Error when saving a comment' };
  }
};

/**
 * Processes a list of tags by removing duplicates, checking for existing tags in the database,
 * and adding non-existing tags. Returns an array of the existing or newly added tags.
 * If an error occurs during the process, it is logged, and an empty array is returned.
 *
 * @param tags The array of Tag objects to be processed.
 *
 * @returns A Promise that resolves to an array of Tag objects.
 */
export const processTags = async (tags: Tag[]): Promise<Tag[]> => {
  try {
    // Extract unique tag names from the provided tags array using a Set to eliminate duplicates
    const uniqueTagNamesSet = new Set(tags.map(tag => tag.name));

    // Create an array of unique Tag objects by matching tag names
    const uniqueTags = [...uniqueTagNamesSet].map(
      name => tags.find(tag => tag.name === name)!, // The '!' ensures the Tag is found, assuming no undefined values
    );

    // Use Promise.all to asynchronously process each unique tag.
    const processedTags = await Promise.all(
      uniqueTags.map(async tag => {
        const existingTag = await TagModel.findOne({ name: tag.name });

        if (existingTag) {
          return existingTag; // If tag exists, return it as part of the processed tags
        }

        const addedTag = await addTag(tag);
        if (addedTag) {
          return addedTag; // If the tag does not exist, attempt to add it to the database
        }

        // Throwing an error if addTag fails
        throw new Error(`Error while adding tag: ${tag.name}`);
      }),
    );

    return processedTags;
  } catch (error: unknown) {
    // Log the error for debugging purposes
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.log('An error occurred while adding tags:', errorMessage);
    return [];
  }
};

/**
 * Adds a vote to a question.
 *
 * @param qid The ID of the question to add a vote to.
 * @param username The username of the user who voted.
 * @param type The type of vote to add, either 'upvote' or 'downvote'.
 *
 * @returns A Promise that resolves to an object containing either a success message or an error message,
 *          along with the updated upVotes and downVotes arrays.
 */
export const addVoteToQuestion = async (
  qid: string,
  username: string,
  type: 'upvote' | 'downvote',
): Promise<{ msg: string; upVotes: string[]; downVotes: string[] } | { error: string }> => {
  let updateOperation: QueryOptions;

  if (type === 'upvote') {
    updateOperation = [
      {
        $set: {
          upVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
              { $concatArrays: ['$upVotes', [username]] },
            ],
          },
          downVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              '$downVotes',
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
            ],
          },
        },
      },
    ];
  } else {
    updateOperation = [
      {
        $set: {
          downVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
              { $concatArrays: ['$downVotes', [username]] },
            ],
          },
          upVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              '$upVotes',
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
            ],
          },
        },
      },
    ];
  }

  try {
    const result = await QuestionModel.findOneAndUpdate({ _id: qid }, updateOperation, {
      new: true,
    });

    if (!result) {
      return { error: 'Question not found!' };
    }

    let msg = '';

    if (type === 'upvote') {
      msg = result.upVotes.includes(username)
        ? 'Question upvoted successfully'
        : 'Upvote cancelled successfully';
    } else {
      msg = result.downVotes.includes(username)
        ? 'Question downvoted successfully'
        : 'Downvote cancelled successfully';
    }

    return {
      msg,
      upVotes: result.upVotes || [],
      downVotes: result.downVotes || [],
    };
  } catch (err) {
    return {
      error:
        type === 'upvote'
          ? 'Error when adding upvote to question'
          : 'Error when adding downvote to question',
    };
  }
};

/**
 * Adds an answer to a question.
 *
 * @param {string} qid - The ID of the question to add an answer to
 * @param {Answer} ans - The answer to add
 *
 * @returns Promise<QuestionResponse> - The updated question or an error message
 */
export const addAnswerToQuestion = async (qid: string, ans: Answer): Promise<QuestionResponse> => {
  try {
    if (!ans || !ans.text || !ans.ansBy || !ans.ansDateTime) {
      throw new Error('Invalid answer');
    }
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [ans._id], $position: 0 } } },
      { new: true },
    );
    if (result === null) {
      throw new Error('Error when adding answer to question');
    }

    await addNotifications(result._id, result.askedBy, NotificationType.ANSWER);
    return result;
  } catch (error) {
    return { error: 'Error when adding answer to question' };
  }
};

/**
 * Adds a comment to a question or answer.
 *
 * @param id The ID of the question or answer to add a comment to
 * @param type The type of the comment, either 'question' or 'answer'
 * @param comment The comment to add
 *
 * @returns A Promise that resolves to the updated question or answer, or an error message if the operation fails
 */
export const addComment = async (
  id: string,
  type: 'question' | 'answer',
  comment: Comment,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!comment || !comment.text || !comment.commentBy || !comment.commentDateTime) {
      throw new Error('Invalid comment');
    }
    let result: QuestionResponse | AnswerResponse | null;
    if (type === 'question') {
      result = await QuestionModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    } else {
      result = await AnswerModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    }
    if (result === null) {
      throw new Error('Failed to add comment');
    }
    return result;
  } catch (error) {
    return { error: `Error when adding comment: ${(error as Error).message}` };
  }
};

/**
 * Gets a map of tags and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of tags to their
 *          counts, `null` if there are no tags in the database, or the error message.
 */
export const getTagCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const tlist = await TagModel.find();
    const qlist = await QuestionModel.find().populate({
      path: 'tags',
      model: TagModel,
    });

    if (!tlist || tlist.length === 0) {
      return null;
    }

    const tmap = new Map(tlist.map(t => [t.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.tags.forEach(t => {
          tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
        });
      });
    }

    return tmap;
  } catch (error) {
    return { error: 'Error when construction tag map' };
  }
};

/**
 * Checks if a user with the given username already exists in the database.
 * @param {string} username - username to check.
 * @returns true if the username is unique, false otherwise.
 */
export const isUsernameUnique = async (username: string): Promise<boolean> => {
  const existingUser = await UserModel.findOne({ username });
  return !existingUser;
};

/**
 * Adds a new user to the database.
 *
 * @param {User} user - The user to add
 *
 * @returns {Promise<UserResponse>} - The added user, or an error message if the addition failed.
 */
export const addUser = async (user: User): Promise<UserResponse> => {
  try {
    const result = await UserModel.create(user);
    return result;
  } catch (error) {
    return { error: 'Error when saving a new user' };
  }
};

/**
 * Finds all questions asked by a given user.
 *
 * @param {User} user - The user to add
 *
 * @returns {Promise<Question[]>} - The list of questions asked by the provided user,
 */
export const findQuestionAskedBy = async (username: string): Promise<Question[]> => {
  try {
    let qlist = [];
    qlist = await QuestionModel.find({ askedBy: username }).populate([
      {
        path: 'tags',
        model: TagModel,
      },
      {
        path: 'answers',
        model: AnswerModel,
        populate: { path: 'comments', model: CommentModel },
      },
      { path: 'comments', model: CommentModel },
    ]);
    return qlist;
  } catch (error) {
    return [];
  }
};

/**

 * Finds all questions downvoted by a given user.
 *
 * @param {User} user - The user to add
 *
 * @returns {Promise<Question[]>} - The list of questions downvoted by the provided user,
 */
export const findQuestionDownvotedBy = async (
  username: string,
): Promise<Question[] | { error: string }> => {
  try {
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return { error: 'User does not exist' };
    }

    let qlist = [];
    qlist = await QuestionModel.find().populate([
      {
        path: 'tags',
        model: TagModel,
      },
      {
        path: 'answers',
        model: AnswerModel,
        populate: { path: 'comments', model: CommentModel },
      },
      { path: 'comments', model: CommentModel },
    ]);
    qlist = qlist.filter(q => q.downVotes.includes(username));
    return qlist;
  } catch (error) {
    return [];
  }
};

/**
 * Finds all questions upvoted by a given user.
 *
 * @param {User} user - The user to add
 *
 * @returns {Promise<Question[]>} - The list of questions upvoted by the provided user,
 */
export const findQuestionUpvotedBy = async (
  username: string,
): Promise<Question[] | { error: string }> => {
  try {
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return { error: 'User does not exist' };
    }

    let qlist = [];
    qlist = await QuestionModel.find().populate([
      {
        path: 'tags',
        model: TagModel,
      },
      {
        path: 'answers',
        model: AnswerModel,
        populate: { path: 'comments', model: CommentModel },
      },
      { path: 'comments', model: CommentModel },
    ]);
    qlist = qlist.filter(q => q.upVotes.includes(username));
    return qlist;
  } catch (error) {
    return [];
  }
};

export const updateUser = async (
  username: string,
  userUpdate: UpdateUserPayload,
): Promise<UserResponse> => {
  const existingUser = await UserModel.findOne({ username });
  if (!existingUser) {
    return { error: 'User does not exist' };
  }

  Object.assign(existingUser, userUpdate);
  await existingUser.save();

  return existingUser as User;
};

/**
 * Updates the notification collection to mark all notifications as seen for a given user.
 * If the provided user is invalid, an error will be returned and no notifications are updated.
 *
 * @param username the username of the user whose notifications should be marked as seen
 * @returns a Promise resolving to void, or an error message if the operation fails
 */
export const markNotificationsAsSeen = async (
  username: string,
): Promise<Notification[] | { error: string }> => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error('Invalid username');
    }
    await NotificationModel.updateMany({ receiverUsername: username, seen: false }, { seen: true });
    return await NotificationModel.find({ receiverUsername: username });
  } catch (error) {
    return { error: `Error when marking notifications as seen: ${(error as Error).message}` };
  }
};

/**
 * Deletes notifications for a given user.
 * If the provided user is invalid, an error will be returned and no notifications are deleted.
 *
 * @param username the username of the user whose notifications should be deleted
 * @returns a Promise resolving to void, or an error message if the operation fails
 */
export const deleteNotificationsForUser = async (
  username: string,
): Promise<{ success: string } | { error: string }> => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error('Invalid username');
    }
    await NotificationModel.deleteMany({ receiverUsername: username }, { seen: true });
    return { success: 'Notifications deleted successfully' };
  } catch (error) {
    return { error: `Error when deleting notifications: ${(error as Error).message}` };
  }
};

/**
 * Adds a new follow object to the database.
 *
 * @param {Follow} follow - The follow object to add. If the follow object already exists in the database, it is deleted.
 *
 * @returns {Promise<FollowResponse>} - A message if the follow obejct was created or deleted, or an error message if the creation or deletion failed.
 */
export const addFollow = async (follow: Follow): Promise<FollowResponse> => {
  try {
    if (
      (await UserModel.findOne({ username: follow.followerUsername })) === undefined ||
      (await UserModel.findOne({ username: follow.followeeUsername })) === undefined
    ) {
      throw new Error('Follower or followee does not exist');
    }

    const existingFollow = await FollowModel.findOne({
      followerUsername: follow.followerUsername,
      followeeUsername: follow.followeeUsername,
    });

    if (existingFollow !== undefined) {
      await FollowModel.deleteOne({
        followerUsername: follow.followerUsername,
        followeeUsername: follow.followeeUsername,
      });
      return { success: 'Follow request deleted' };
    }
    await FollowModel.create(follow);
    return { success: 'Follow request created' };
  } catch (error) {
    return { error: 'Error when creating or deleting a follow request' };
  }
};

/**
 * Retrieves all notifications for a given user.
 * If the provided user is invalid, an error will be returned.
 *
 * @param username the username of the user whose notifications should be retrieved
 * @returns a Promise resolving to void, or an error message if the operation fails
 */
export const getNotificationsForUser = async (
  username: string,
  type?: NotificationType,
): Promise<Notification[] | { error: string }> => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error('Invalid username');
    }

    // if type is provided, filter notifications by type
    if (type) {
      const notifications = await NotificationModel.find({
        receiverUsername: username,
        notificationType: type,
      }).populate('eventId');
      return notifications;
    }

    // otherwise, find all notifications for the user
    const notifications = await NotificationModel.find({ receiverUsername: username }).populate(
      'eventId',
    );
    return notifications;
  } catch (error) {
    return { error: `Error when getting notifications: ${(error as Error).message}` };
  }
};

/**
 * Retrieves all followers and following for a given user.
 * If the provided user is invalid, an error will be returned.
 *
 * @param username the username of the user whose followers and following should be retrieved
 * @returns a Promise resolving to void, or an error message if the operation fails
 */
export const getFollowersAndFollowingForUser = async (
  username: string,
): Promise<{ followers: Follow[]; following: Follow[] } | { error: string }> => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error('Invalid username');
    }

    const followers = await FollowModel.find({ followeeUsername: username });
    const following = await FollowModel.find({ followerUsername: username });

    return { followers, following };
  } catch (error) {
    return { error: `Error when getting followers and following: ${(error as Error).message}` };
  }
};
