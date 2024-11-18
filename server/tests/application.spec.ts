import { ObjectId } from 'mongodb';
import { Query } from 'mongoose';
import Tags from '../models/tags';
import QuestionModel from '../models/questions';
import {
  addTag,
  getQuestionsByOrder,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  saveQuestion,
  processTags,
  saveAnswer,
  addFollow,
  addAnswerToQuestion,
  getTagCountMap,
  saveComment,
  addComment,
  addVoteToQuestion,
  addUser,
  isUsernameUnique,
  findQuestionAskedBy,
  findQuestionAnsweredBy,
  markNotificationsAsSeen,
  getNotificationsForUser,
  updateUser,
  findQuestionUpvotedBy,
  deleteNotificationsForUser,
  getFollowersAndFollowingForUser,
  findQuestionDownvotedBy,
  checkAutobiographerBadge,
  checkVoterBadge,
  checkSpeedyAnswererBadge,
  checkCommunityHelperBadge,
  checkTopAnswererBadge,
  checkLifesaverBadge,
  addBadge,
  getFeedForUser,
} from '../models/application';
import {
  Answer,
  Question,
  Tag,
  Comment,
  User,
  Notification,
  NotificationType,
  Follow,
  FollowResponse,
  FeedPostType,
  FeedPost,
} from '../types';
import { T1_DESC, T2_DESC, T3_DESC } from '../data/posts_strings';
import AnswerModel from '../models/answers';
import UserModel from '../models/users';
import NotificationModel from '../models/notifications';
import FollowModel from '../models/follows';
import BadgeModel from '../models/badges';
import CommentModel from '../models/comments';
import { feedUser, populatedAnswer1, populatedComment1, populatedQuestion1 } from './mockObjects';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const tag1: Tag = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'react',
  description: T1_DESC,
};

const tag2: Tag = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'javascript',
  description: T2_DESC,
};

const tag3: Tag = {
  _id: new ObjectId('65e9b4b1766fca9451cba653'),
  name: 'android',
  description: T3_DESC,
};

const com1: Comment = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'com1',
  commentBy: 'com_by1',
  commentDateTime: new Date('2023-11-18T09:25:00'),
};

const ans1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ansBy: 'ansBy1',
  ansDateTime: new Date('2023-11-18T09:24:00'),
  comments: [],
};

const ans2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ansBy: 'ansBy2',
  ansDateTime: new Date('2023-11-20T09:24:00'),
  comments: [],
};

const ans3: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'ans3',
  ansBy: 'ansBy3',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
};

const ans4: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'ans4',
  ansBy: 'ansBy4',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
};

const QUESTIONS: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [ans1, ans2],
    askedBy: 'q_by1',
    askDateTime: new Date('2023-11-16T09:24:00'),
    views: ['question1_user', 'question2_user'],
    upVotes: ['dummyUser'],
    downVotes: ['user1'],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [ans1, ans2, ans3],
    askedBy: 'q_by2',
    askDateTime: new Date('2023-11-17T09:24:00'),
    views: ['question2_user'],
    upVotes: ['user1'],
    downVotes: ['dummyUser'],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [ans4],
    askedBy: 'q_by3',
    askDateTime: new Date('2023-11-19T09:24:00'),
    views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
    upVotes: ['user1'],
    downVotes: ['dummyUser'],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by4',
    askDateTime: new Date('2023-11-20T09:24:00'),
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de08'),
    title: 'Unanswered Question #3',
    text: 'Does something like that even exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by4',
    askDateTime: new Date('2023-11-21T09:24:00'),
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [com1],
  },
];

const USERS: User[] = [
  {
    username: 'dummyUser',
    firstName: 'Dummy',
    lastName: 'User',
    email: 'dummyUser@email.com',
    badges: [],
    createdAt: new Date('2024-06-03'),
  },

  {
    username: 'user1',
    firstName: 'User',
    lastName: 'One',
    email: 'user1@email.com',
    badges: [],
    createdAt: new Date('2024-06-04'),
  },

  {
    username: 'user2',
    firstName: 'User',
    lastName: 'Two',
    email: 'userTwo@email.com',
    badges: [],
    createdAt: new Date('2024-06-03'),
  },

  {
    username: 'receiver3',
    firstName: 'reciever',
    lastName: 'three',
    email: 'user3@email.com',
    badges: [],
    createdAt: new Date('2024-06-03'),
  },
];

const FOLLOWS: Follow[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
    followerUsername: 'user1',
    followeeUsername: 'user2',
    followDateTime: new Date('2023-11-19T09:24:00'),
  },
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e7de'),
    followerUsername: 'user2',
    followeeUsername: 'user1',
    followDateTime: new Date('2023-11-19T09:24:00'),
  },
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e7de'),
    followerUsername: 'user1',
    followeeUsername: 'com_by1',
    followDateTime: new Date('2023-11-19T09:24:00'),
  },
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e7de'),
    followerUsername: 'user1',
    followeeUsername: 'ansBy1',
    followDateTime: new Date('2023-11-19T09:24:00'),
  },
];

describe('application module', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });
  describe('Question model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('filterQuestionsBySearch', () => {
      test('filter questions with empty search string should return all questions', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '');

        expect(result.length).toEqual(QUESTIONS.length);
      });

      test('filter questions with empty list of questions should return empty list', () => {
        const result = filterQuestionsBySearch([], 'react');

        expect(result.length).toEqual(0);
      });

      test('filter questions with empty questions and empty string should return empty list', () => {
        const result = filterQuestionsBySearch([], '');

        expect(result.length).toEqual(0);
      });

      test('filter question by one tag', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android]');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('filter question by multiple tags', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android] [react]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one user', () => {
        const result = filterQuestionsByAskedBy(QUESTIONS, 'q_by4');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de08');
      });

      test('filter question by tag and then by user', () => {
        let result = filterQuestionsBySearch(QUESTIONS, '[javascript]');
        result = filterQuestionsByAskedBy(result, 'q_by2');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by tag and keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website [android]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });
    });

    describe('getQuestionsByOrder', () => {
      test('get active questions, newest questions sorted by most recently answered 1', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS.slice(0, 3), 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get active questions, newest questions sorted by most recently answered 2', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            answers: [ans1, ans3], // 18, 19 => 19
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de02',
            answers: [ans1, ans2, ans3, ans4], // 18, 20, 19, 19 => 20
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de03',
            answers: [ans1], // 18 => 18
            askDateTime: new Date('2023-11-19T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            answers: [ans4], // 19 => 19
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            answers: [],
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(5);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[4]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest unanswered questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('unanswered');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de08');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('get newest questions', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest most viewed questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('mostViewed');

        expect(result.length).toEqual(5);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de08');
        expect(result[4]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('getQuestionsByOrder should return empty list if find throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByOrder should return empty list if find returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });
    });

    describe('findQuestionAnsweredBy', () => {
      test('findQuestionAnsweredBy should return all questions answered by user, only one question', async () => {
        mockingoose(AnswerModel).toReturn([ans4], 'find');
        mockingoose(QuestionModel).toReturn([QUESTIONS[2]], 'find');

        const result = (await findQuestionAnsweredBy('ansBy4')) as Question[];

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[0].answers).toHaveLength(1);
      });

      test('findQuestionAnsweredBy should return all questions answered by user, more than one question', async () => {
        mockingoose(AnswerModel).toReturn([ans1], 'find');
        mockingoose(QuestionModel).toReturn([QUESTIONS[0], QUESTIONS[1]], 'find');

        const result = (await findQuestionAnsweredBy('ansBy1')) as Question[];

        expect(result).toHaveLength(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('findQuestionAnsweredBy should return empty list, no questions answered by username', async () => {
        mockingoose(AnswerModel).toReturn([ans1], 'find');
        mockingoose(QuestionModel).toReturn([], 'find');

        const result = await findQuestionAnsweredBy('ansBy4');

        expect(result).toHaveLength(0);
      });

      test('findQuestionAnsweredBy should return empty list if find returns an error', async () => {
        mockingoose(AnswerModel).toReturn([ans1], 'find');
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await findQuestionAnsweredBy('ansBy4');

        expect(result).toEqual({
          error: 'Error when finding questions answered by specified user: error',
        });
      });
    });

    describe('findQuestionAskedBy', () => {
      test('findQuestionAskedBy should return all questions asked by user, only one question', async () => {
        mockingoose(QuestionModel).toReturn([QUESTIONS[0]], 'find');
        const result = await findQuestionAskedBy('q_by1');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('findQuestionAskedBy should return all questions asked by user, more than one question', async () => {
        mockingoose(QuestionModel).toReturn([QUESTIONS[3], QUESTIONS[4]], 'find');
        const result = await findQuestionAskedBy('q_by4');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de08');
      });

      test('findQuestionAskedBy should return empty list, no questions asked by username', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        const result = await findQuestionAskedBy('q_by5');

        expect(result.length).toEqual(0);
      });

      test('findQuestionAskedBy should return empty list if find returns an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');
        const result = await findQuestionAskedBy('q_by1');

        expect(result.length).toEqual(0);
      });
    });

    describe('findQuestionDownvotedBy', () => {
      it('findQuestionDownvotedBy should return all questions downvoted by user, only one question', async () => {
        mockingoose(QuestionModel).toReturn([QUESTIONS[0]], 'find');
        mockingoose(UserModel).toReturn(USERS[1], 'findOne');

        const result = (await findQuestionDownvotedBy('user1')) as Question[];

        expect(result).toHaveLength(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('findQuestionDownvotedBy should return all questions downvoted by user, more than one question', async () => {
        mockingoose(QuestionModel).toReturn([QUESTIONS[1], QUESTIONS[2]], 'find');
        mockingoose(UserModel).toReturn(USERS[0], 'findOne');

        const result = (await findQuestionDownvotedBy('dummyUser')) as Question[];

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('findQuestionDownvotedBy should return empty list, no questions downvoted by username', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        mockingoose(UserModel).toReturn(USERS[2], 'findOne');

        const result = (await findQuestionDownvotedBy('user2')) as Question[];

        expect(result.length).toEqual(0);
      });

      test('findQuestionDownvotedBy should return empty list if find returns an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');
        mockingoose(UserModel).toReturn(USERS[1], 'findOne');

        const result = (await findQuestionDownvotedBy('user1')) as Question[];

        expect(result.length).toEqual(0);
      });

      test('findQuestionDownvotedBy should return an error when the provided username is invalid', async () => {
        const result = (await findQuestionDownvotedBy('notARealUser')) as Question[];

        expect(result).toEqual({ error: 'User does not exist' });
      });
    });

    describe('findQuestionUpvotedBy', () => {
      it('findQuestionUpvotedBy should return all questions upvoted by user, only one question', async () => {
        mockingoose(QuestionModel).toReturn([QUESTIONS[0]], 'find');
        mockingoose(UserModel).toReturn(USERS[0], 'findOne');

        const result = (await findQuestionUpvotedBy('dummyUser')) as Question[];

        expect(result).toHaveLength(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('findQuestionUpvotedBy should return all questions upvoted by user, more than one question', async () => {
        mockingoose(QuestionModel).toReturn([QUESTIONS[1], QUESTIONS[2]], 'find');
        mockingoose(UserModel).toReturn(USERS[1], 'findOne');

        const result = (await findQuestionUpvotedBy('user1')) as Question[];

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('findQuestionUpvotedBy should return empty list, no questions upvoted by username', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        mockingoose(UserModel).toReturn(USERS[2], 'findOne');

        const result = (await findQuestionUpvotedBy('user2')) as Question[];

        expect(result.length).toEqual(0);
      });

      test('findQuestionUpvotedBy should return empty list if find returns an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');
        mockingoose(UserModel).toReturn(USERS[1], 'findOne');

        const result = (await findQuestionUpvotedBy('user1')) as Question[];

        expect(result.length).toEqual(0);
      });

      test('findQuestionUpvotedBy should return an error when the provided username is invalid', async () => {
        const result = (await findQuestionUpvotedBy('notARealUser')) as Question[];

        expect(result).toEqual({ error: 'User does not exist' });
      });
    });

    describe('fetchAndIncrementQuestionViewsById', () => {
      test('fetchAndIncrementQuestionViewsById should return question and add the user to the list of views if new', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(
          { ...question, views: ['question1_user', ...question.views] },
          'findOneAndUpdate',
        );
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question1_user',
        )) as Question;

        expect(result.views.length).toEqual(2);
        expect(result.views).toEqual(['question1_user', 'question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return question and not add the user to the list of views if already viewed by them', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question2_user',
        )) as Question;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(['question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return null if id does not exist', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question1_user',
        );

        expect(result).toBeNull();
      });

      test('fetchAndIncrementQuestionViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question2_user',
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a question');
      });
    });

    describe('saveQuestion', () => {
      test('saveQuestion should return the saved question', async () => {
        const mockQn = {
          title: 'New Question Title',
          text: 'New Question Text',
          tags: [tag1, tag2],
          askedBy: 'question3_user',
          askDateTime: new Date('2024-06-06'),
          answers: [],
          views: [],
          upVotes: [],
          downVotes: [],
          comments: [],
        };

        const result = (await saveQuestion(mockQn)) as Question;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockQn.title);
        expect(result.text).toEqual(mockQn.text);
        expect(result.tags[0]._id?.toString()).toEqual(tag1._id?.toString());
        expect(result.tags[1]._id?.toString()).toEqual(tag2._id?.toString());
        expect(result.askedBy).toEqual(mockQn.askedBy);
        expect(result.askDateTime).toEqual(mockQn.askDateTime);
        expect(result.views).toEqual([]);
        expect(result.answers.length).toEqual(0);
      });
    });

    describe('addVoteToQuestion', () => {
      test('addVoteToQuestion should upvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
          earnedBadges: [],
        });
      });

      test('If a downvoter upvotes, add them to upvotes and remove them from downvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
          earnedBadges: [],
        });
      });

      test('should cancel the upvote if already upvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Upvote cancelled successfully',
          upVotes: [],
          downVotes: [],
          earnedBadges: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding an upvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Error when adding upvote to question' });
      });

      test('addVoteToQuestion should downvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
          earnedBadges: [],
        });
      });

      test('If an upvoter downvotes, add them to downvotes and remove them from upvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
          earnedBadges: [],
        });
      });

      test('should cancel the downvote if already downvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Downvote cancelled successfully',
          upVotes: [],
          downVotes: [],
          earnedBadges: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding a downvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Error when adding downvote to question' });
      });
    });

    describe('checkSpeedyAnswererBadge', () => {
      const qid = '507f1f77bcf86cd799439011';

      it('should return true if the question was asked within 30 minutes', async () => {
        const recentQuestion = {
          _id: qid,
          askDateTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        };
        mockingoose(QuestionModel).toReturn(recentQuestion, 'findOne');

        const result = await checkSpeedyAnswererBadge(qid);
        expect(result).toBe(true);
      });

      it('should return false if the question was asked more than 30 minutes ago', async () => {
        const olderQuestion = {
          _id: qid,
          askDateTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        };
        mockingoose(QuestionModel).toReturn(olderQuestion, 'findOne');

        const result = await checkSpeedyAnswererBadge(qid);
        expect(result).toBe(false);
      });

      it('should return false if the question does not exist', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOne');

        const result = await checkSpeedyAnswererBadge(qid);
        expect(result).toBe(false);
      });

      it('should handle errors if the database query fails', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOne');

        await expect(checkSpeedyAnswererBadge(qid)).rejects.toThrow(
          'Error checking speedy voter badge eligibility',
        );
      });
    });

    describe('checkTopAnswererBadge', () => {
      const username = 'testUser';

      it('should return true if the user has answered 20 or more questions', async () => {
        mockingoose(QuestionModel).toReturn(
          Array(20)
            .fill(null)
            .map((_, index) => ({
              _id: new ObjectId(),
              title: `Question ${index + 1}`,
              text: `This is the text for question ${index + 1}`,
              tags: [tag1, tag2],
              answers: [
                {
                  _id: new ObjectId(),
                  text: `Answer ${index + 1}`,
                  ansBy: username,
                  ansDateTime: new Date(),
                  comments: [],
                },
              ],
              askedBy: username,
              askDateTime: new Date(),
              views: [],
              upVotes: [],
              downVotes: [],
              comments: [],
            })),
          'find',
        );

        const result = await checkTopAnswererBadge(username);
        expect(result).toBe(true);
      });

      it('should return false if the user has answered fewer than 20 questions', async () => {
        mockingoose(QuestionModel).toReturn(
          Array(10)
            .fill(null)
            .map((_, index) => ({
              _id: new ObjectId(),
              title: `Question ${index + 1}`,
              text: `This is the text for question ${index + 1}`,
              tags: [tag1, tag2],
              answers: [
                {
                  _id: new ObjectId(),
                  text: `Answer ${index + 1}`,
                  ansBy: username,
                  ansDateTime: new Date(),
                  comments: [],
                },
              ],
              askedBy: username,
              askDateTime: new Date(),
              views: [],
              upVotes: [],
              downVotes: [],
              comments: [],
            })),
          'find',
        );

        const result = await checkTopAnswererBadge(username);
        expect(result).toBe(false);
      });

      it('should handle errors if the database query fails', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'countDocuments');

        await expect(checkTopAnswererBadge(username)).rejects.toThrow(
          'Error checking top answerer badge eligibility',
        );
      });
    });

    describe('checkLifesaverBadge', () => {
      const qid = '507f1f77bcf86cd799439011'; // example question ID
      // const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // date exactly one week ago

      it('should return true if the question has 50 or more upvotes and was asked within the last week', async () => {
        const recentQuestion = {
          _id: qid,
          askDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          upVotes: Array(50),
        };
        mockingoose(QuestionModel).toReturn(recentQuestion, 'findOne');

        const result = await checkLifesaverBadge(qid);
        expect(result).toBe(true);
      });

      it('should return false if the question has fewer than 50 upvotes', async () => {
        const recentQuestion = {
          _id: qid,
          askDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          upVotes: Array(30),
        };
        mockingoose(QuestionModel).toReturn(recentQuestion, 'findOne');

        const result = await checkLifesaverBadge(qid);
        expect(result).toBe(false);
      });

      it('should return false if the question was asked more than one week ago', async () => {
        const oldQuestion = {
          _id: qid,
          askDateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          upVotes: Array(50), // 50 upvotes
        };
        mockingoose(QuestionModel).toReturn(oldQuestion, 'findOne');

        const result = await checkLifesaverBadge(qid);
        expect(result).toBe(false);
      });

      it('should return false if the question does not exist', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOne');

        const result = await checkLifesaverBadge(qid);
        expect(result).toBe(false);
      });

      it('should handle errors if the database query fails', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOne');

        await expect(checkLifesaverBadge(qid)).rejects.toThrow(
          'Error checking lifesaver badge eligibility',
        );
      });
    });
  });

  describe('Answer model', () => {
    describe('saveAnswer', () => {
      test('saveAnswer should return the saved answer', async () => {
        const mockAnswer = {
          text: 'This is a test answer',
          ansBy: 'dummyUserId',
          ansDateTime: new Date('2024-06-06'),
          comments: [],
        };

        const result = (await saveAnswer(mockAnswer)) as Answer;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(mockAnswer.text);
        expect(result.ansBy).toEqual(mockAnswer.ansBy);
        expect(result.ansDateTime).toEqual(mockAnswer.ansDateTime);
      });
    });

    describe('addAnswerToQuestion', () => {
      test('addAnswerToQuestion should return the updated question', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        (question.answers as Answer[]).push(ans4);
        jest.spyOn(QuestionModel, 'findOneAndUpdate').mockResolvedValueOnce(question);
        jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce(question);
        jest.spyOn(AnswerModel, 'countDocuments').mockResolvedValueOnce(5);
        mockingoose(QuestionModel).toReturn(
          Array(5)
            .fill(null)
            .map((_, index) => ({
              _id: new ObjectId(),
              title: `Question ${index + 1}`,
              text: `This is the text for question ${index + 1}`,
              tags: [tag1, tag2],
              answers: [
                {
                  _id: new ObjectId(),
                  text: `Answer ${index + 1}`,
                  ansBy: 'username',
                  ansDateTime: new Date(),
                  comments: [],
                },
              ],
              askedBy: 'username',
              askDateTime: new Date(),
              views: [],
              upVotes: [],
              downVotes: [],
              comments: [],
            })),
          'find',
        );

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);
        if (result && 'error' in result) {
          fail();
        }

        const questionResult = result.question as Question;

        expect(questionResult.answers.length).toEqual(4);
        expect(questionResult.answers).toContain(ans4);
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should throw an error if a required field is missing in the answer', async () => {
        const invalidAnswer: Partial<Answer> = {
          text: 'This is an answer text',
          ansBy: 'user123', // Missing ansDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addAnswerToQuestion(qid, invalidAnswer as Answer);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid answer');
        }
      });
    });

    describe('checkCommunityHelperBadge', () => {
      const username = 'testUser';

      // beforeEach(() => {
      //   jest.clearAllMocks();
      //   mockingoose.resetAll();
      // });

      // // Optional: Clean up after all tests
      // afterAll(() => {
      //   mockingoose.resetAll();
      // });

      it('should return true if the user has answered 10 or more questions in the past week', async () => {
        jest.spyOn(AnswerModel, 'countDocuments').mockResolvedValue(15);

        const result = await checkCommunityHelperBadge(username);
        expect(result).toBe(true);
      });

      it('should return false if the user has fewer than 10 answers in the past week', async () => {
        jest.spyOn(AnswerModel, 'countDocuments').mockResolvedValue(5);

        const result = await checkCommunityHelperBadge(username);
        expect(result).toBe(false);
      });

      it('should return false if the user has no recent answers', async () => {
        jest.spyOn(AnswerModel, 'countDocuments').mockResolvedValue(0);

        const result = await checkCommunityHelperBadge(username);
        expect(result).toBe(false);
      });

      it('should handle errors if the database query fails', async () => {
        jest.spyOn(AnswerModel, 'countDocuments').mockRejectedValue(new Error('Database error'));

        await expect(checkCommunityHelperBadge(username)).rejects.toThrow(
          'Error checking community helper badge eligibility',
        );
      });
    });
  });

  describe('Tag model', () => {
    describe('addTag', () => {
      test('addTag return tag if the tag already exists', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result?._id).toEqual(tag1._id);
      });

      test('addTag return tag id of new tag if does not exist in database', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeDefined();
      });

      test('addTag returns null if findOne throws an error', async () => {
        mockingoose(Tags).toReturn(new Error('error'), 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result).toBeNull();
      });

      test('addTag returns null if save throws an error', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(new Error('error'), 'save');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeNull();
      });
    });

    describe('processTags', () => {
      test('processTags should return the tags of tag names in the collection', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(tag1._id);
        expect(result[1]._id).toEqual(tag1._id);
      });

      test('processTags should return a list of new tags ids if they do not exist in the collection', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
      });

      test('processTags should return empty list if an error is thrown when finding tags', async () => {
        mockingoose(Tags).toReturn(Error('Dummy error'), 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });

      test('processTags should return empty list if an error is thrown when saving tags', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(Error('Dummy error'), 'save');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });
    });

    describe('getTagCountMap', () => {
      test('getTagCountMap should return a map of tag names and their counts', async () => {
        mockingoose(Tags).toReturn([tag1, tag2, tag3], 'find');
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        QuestionModel.schema.path('tags', Object);

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.size).toEqual(3);
        expect(result.get('react')).toEqual(1);
        expect(result.get('javascript')).toEqual(2);
        expect(result.get('android')).toEqual(1);
      });

      test('getTagCountMap should return an object with error if an error is thrown', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return an object with error if an error is thrown when finding tags', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return null if Tags find returns null', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(null, 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });

      test('getTagCountMap should return default map if QuestionModel find returns null but not tag find', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');
        mockingoose(Tags).toReturn([tag1], 'find');

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.get('react')).toBe(0);
      });

      test('getTagCountMap should return null if find returns []', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        mockingoose(Tags).toReturn([], 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });
    });
  });

  describe('Comment model', () => {
    describe('saveComment', () => {
      test('saveComment should return the saved comment', async () => {
        const result = (await saveComment(com1)) as Comment;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(com1.text);
        expect(result.commentBy).toEqual(com1.commentBy);
        expect(result.commentDateTime).toEqual(com1.commentDateTime);
      });
    });

    describe('addComment', () => {
      test('addComment should return the updated question when given `question`', async () => {
        // copy the question to avoid modifying the original
        const question = { ...QUESTIONS[0], comments: [com1] };
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');

        const result = (await addComment(
          question._id?.toString() as string,
          'question',
          com1,
        )) as Question;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return the updated answer when given `answer`', async () => {
        // copy the answer to avoid modifying the original
        const answer: Answer = { ...ans1 };
        (answer.comments as Comment[]).push(com1);
        mockingoose(AnswerModel).toReturn(answer, 'findOneAndUpdate');

        const result = (await addComment(
          answer._id?.toString() as string,
          'answer',
          com1,
        )) as Answer;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return an object with error if findOneAndUpdate throws an error', async () => {
        const question = QUESTIONS[0];
        mockingoose(QuestionModel).toReturn(
          new Error('Error from findOneAndUpdate'),
          'findOneAndUpdate',
        );
        const result = await addComment(question._id?.toString() as string, 'question', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Error from findOneAndUpdate' });
      });

      test('addComment should return an object with error if findOneAndUpdate returns null', async () => {
        const answer: Answer = { ...ans1 };
        mockingoose(AnswerModel).toReturn(null, 'findOneAndUpdate');
        const result = await addComment(answer._id?.toString() as string, 'answer', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Failed to add comment' });
      });

      test('addComment should throw an error if a required field is missing in the comment', async () => {
        const invalidComment: Partial<Comment> = {
          text: 'This is an answer text',
          commentBy: 'user123', // Missing commentDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addComment(qid, 'question', invalidComment as Comment);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid comment');
        }
      });
    });
  });

  describe('User model', () => {
    describe('addUser', () => {
      test('addUser should return the added user', async () => {
        const result = (await addUser(USERS[0])) as User;

        expect(result.username).toEqual(USERS[0].username);
        expect(result.firstName).toEqual(USERS[0].firstName);
        expect(result.lastName).toEqual(USERS[0].lastName);
        expect(result.email).toEqual(USERS[0].email);
        expect(result.badges).toEqual([]);
        expect(result.createdAt).toEqual(USERS[0].createdAt);
      });
    });

    describe('isUsernameUnique', () => {
      test('isUsernameUnique should return false if a user with the given username already exists in the database', async () => {
        mockingoose(UserModel).toReturn({ ...USERS[0] }, 'findOne');

        const unique = await isUsernameUnique(USERS[0].username);

        expect(unique).toEqual(false);
      });

      test('isUsernameUnique should return true if a user with the given username does not exist in the database', async () => {
        const unique = await isUsernameUnique(USERS[0].username);

        expect(unique).toEqual(true);
      });
    });

    describe('updateUser', () => {
      const username = 'dummyUser';
      const mockUser = {
        username,
        firstName: 'Dummy',
        lastName: 'User',
        email: 'dummy@gmail.com',
        createdAt: new Date('2024-06-03').toISOString(),
        headline: 'Software engineer',
        bio: 'Software engineer in Boston',
      };

      it('updateUser should return the updated user', async () => {
        const mockReqBody = {
          headline: 'Aspiring software engineer',
          bio: 'Software engineer in Boston looking to connect with other engineers',
          githubUrl: 'www.github.com',
          company: 'Google',
          school: 'Northeastern University',
          city: 'Boston',
          state: 'Massachusetts',
          avatarName: 'avatar1',
        };

        mockingoose(UserModel).toReturn(mockUser, 'findOne');
        const expectedResult = { ...mockUser, ...mockReqBody };
        mockingoose(UserModel).toReturn(expectedResult, 'findOneAndUpdate');

        const result = await updateUser(username, mockReqBody);
        expect(result).toMatchObject(mockReqBody);
      });

      it('updateUser should handle partial updates properly', async () => {
        const mockReqBody = {
          city: 'Boston',
          state: 'Massachusetts',
          avatarName: 'avatar1',
        };

        mockingoose(UserModel).toReturn(mockUser, 'findOne');
        const expectedResult = { ...mockUser, ...mockReqBody };
        mockingoose(UserModel).toReturn(expectedResult, 'findOneAndUpdate');

        const result = (await updateUser(username, mockReqBody)) as User;
        expect(result).toMatchObject(mockReqBody);
        expect(result.headline).toEqual(mockUser.headline);
        expect(result.bio).toEqual(mockUser.bio);
      });

      it('updateUser should return an error when the provided username is invalid', async () => {
        const mockReqBody = {
          headline: 'Aspiring software engineer',
          bio: 'Software engineer in Boston looking to connect with other engineers',
          githubUrl: 'www.github.com',
          company: 'Google',
          school: 'Northeastern University',
          city: 'Boston',
          state: 'Massachusetts',
          avatarName: 'avatar1',
        };

        const expectedResult = { ...mockUser, ...mockReqBody };
        mockingoose(UserModel).toReturn(expectedResult, 'findOneAndUpdate');

        const result = await updateUser('notARealUser', mockReqBody);
        expect(result).toEqual({ error: 'User does not exist' });
      });
    });

    describe('checkAutobiographerBadge', () => {
      const fullUser = {
        username: 'testUser',
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        headline: 'Software Engineer',
        bio: 'Passionate about technology.',
        githubUrl: 'https://github.com/testUser',
        company: 'Test Company',
        school: 'Test University',
        city: 'Test City',
        state: 'Test State',
        badges: [],
        createdAt: new Date(),
      };

      it('should return true when all required fields are present', () => {
        const user = { ...fullUser };
        expect(checkAutobiographerBadge(user)).toBe(true);
      });

      it('should return false when firstName is missing', () => {
        const user = { ...fullUser, firstName: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });

      it('should return false when lastName is missing', () => {
        const user = { ...fullUser, lastName: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });

      it('should return false when email is missing', () => {
        const user = { ...fullUser, email: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });

      it('should return false when headline is missing', () => {
        const user = { ...fullUser, headline: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });

      it('should return false when bio is missing', () => {
        const user = { ...fullUser, bio: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });

      it('should return false when githubUrl is missing', () => {
        const user = { ...fullUser, githubUrl: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });

      it('should return false when company is missing', () => {
        const user = { ...fullUser, company: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });

      it('should return false when school is missing', () => {
        const user = { ...fullUser, school: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });

      it('should return false when city is missing', () => {
        const user = { ...fullUser, city: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });

      it('should return false when state is missing', () => {
        const user = { ...fullUser, state: '' };
        expect(checkAutobiographerBadge(user)).toBe(false);
      });
    });

    describe('checkVoterBadge', () => {
      const username = 'testUser';

      it('should return true when the user has exactly one vote', async () => {
        mockingoose(QuestionModel).toReturn(1, 'countDocuments');
        const result = await checkVoterBadge(username);
        expect(result).toBe(true);
      });

      it('should return false when the user has no votes', async () => {
        mockingoose(QuestionModel).toReturn(0, 'countDocuments');
        const result = await checkVoterBadge(username);
        expect(result).toBe(false);
      });

      it('should return false when the user has more than one vote', async () => {
        mockingoose(QuestionModel).toReturn(2, 'countDocuments');
        const result = await checkVoterBadge(username);
        expect(result).toBe(false);
      });

      it('should handle errors if the database query fails', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'countDocuments');

        await expect(checkVoterBadge(username)).rejects.toThrow(
          'Error checking voter badge eligibility',
        );
      });
    });

    describe('addBadge', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      const mockUser = USERS[0];

      test('should add a badge to the user if they do not already have it', async () => {
        const badgeId = new ObjectId('673425329c00935604e19ea6');
        jest
          .spyOn(UserModel, 'findOne')
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(null);
        jest.spyOn(BadgeModel, 'findOne').mockResolvedValueOnce(badgeId);
        jest
          .spyOn(UserModel, 'findOneAndUpdate')
          .mockResolvedValueOnce({ ...mockUser, badges: [badgeId] });

        const result = await addBadge('dummyUser', 'AUTOBIOGRAPHER');
        if (result && 'error' in result) {
          fail();
        }
        const user = result.user as User;

        expect(user.badges).toContainEqual(badgeId);
        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
          { username: 'dummyUser' },
          { $addToSet: { badges: badgeId } },
          { new: true },
        );
      });

      test('should return the user as-is if they already have the badge', async () => {
        const badgeId = new ObjectId('673425329c00935604e19ea6');
        const user = { ...mockUser, badges: [badgeId] };

        const userWithBadge = { user: { ...mockUser, badges: [badgeId] }, badgeEarned: undefined };

        jest
          .spyOn(UserModel, 'findOne')
          .mockResolvedValueOnce(user)
          .mockResolvedValueOnce(userWithBadge);
        jest.spyOn(BadgeModel, 'findOne').mockResolvedValueOnce(badgeId);
        // .mockResolvedValueOnce({ name: 'AUTOBIOGRAPHER', description: 'Completed profile' });

        const result = await addBadge('dummyUser', 'AUTOBIOGRAPHER');

        expect(result).toEqual(userWithBadge);
      });

      test('should return an error if the username is invalid', async () => {
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);

        const result = await addBadge('nonexistentuser', 'VOTER');

        expect(result).toEqual({ error: 'Error when adding badge to user: Invalid username' });
      });

      test('should return an error if the badge name is invalid', async () => {
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mockUser);

        const result = await addBadge('dummyUser', 'INVALID_BADGE');

        expect(result).toEqual({ error: 'Error when adding badge to user: Invalid badge name' });
      });
    });
  });

  describe('Notification model', () => {
    const notifications: Notification[] = [
      {
        _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
        notificationType: NotificationType.ANSWER,
        eventId: new ObjectId('73e9b58910afe6e94fc6e6de'),
        receiverUsername: 'receiver1',
        notificationDate: new Date('2023-11-19T09:24:00'),
        seen: false,
      },
      {
        _id: new ObjectId('91e9b58910afe6e94fc6e6de'),
        notificationType: NotificationType.ANSWER,
        eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
        receiverUsername: 'receiver1',
        notificationDate: new Date('2023-11-19T09:24:00'),
        seen: false,
      },
      {
        _id: new ObjectId('91e9b58910afe6e94fc6e6de'),
        notificationType: NotificationType.ANSWER,
        eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
        receiverUsername: 'receiver2',
        notificationDate: new Date('2023-11-19T09:24:00'),
        seen: false,
      },

      {
        _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
        notificationType: NotificationType.ANSWER,
        eventId: new ObjectId('73e9b58910afe6e94fc6e6de'),
        receiverUsername: 'receiver3',
        notificationDate: new Date('2023-11-19T09:24:00'),
        seen: false,
      },

      {
        _id: new ObjectId('91e9b58910afe6e94fc6e6de'),
        notificationType: NotificationType.BADGE,
        eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
        receiverUsername: 'receiver3',
        notificationDate: new Date('2023-11-19T09:24:00'),
        seen: false,
      },

      {
        _id: new ObjectId('91e9b58910afe6e94fc6e6de'),
        notificationType: NotificationType.FOLLOW,
        eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
        receiverUsername: 'receiver3',
        notificationDate: new Date('2023-11-19T09:24:00'),
        seen: false,
      },
      {
        _id: new ObjectId('91e9c58910afe6e94fc6e6de'),
        notificationType: NotificationType.COMMENT,
        eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
        receiverUsername: 'receiver3',
        notificationDate: new Date('2023-11-19T09:24:00'),
        seen: false,
      },
      {
        _id: new ObjectId('91e9c58910afe6e94fc6e6de'),
        notificationType: NotificationType.COMMENT,
        eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
        receiverUsername: 'receiver4',
        notificationDate: new Date('2023-11-19T09:24:00'),
        seen: false,
      },
    ];
    describe('markNotificationsAsSeen', () => {
      test('markNotificationsAsSeen should update the notifications of the specified user', async () => {
        const expectedResults = notifications
          .filter(notif => notif.receiverUsername === 'receiver1')
          .map(result => ({ ...result, seen: true }));

        mockingoose(UserModel).toReturn(USERS[0], 'findOne');
        mockingoose(NotificationModel).toReturn(expectedResults, 'updateMany');
        mockingoose(NotificationModel).toReturn(expectedResults, 'find');

        const result = (await markNotificationsAsSeen('receiver1')) as Notification[];

        expect(result).toHaveLength(2);
        expect(result[0].seen).toBe(true);
        expect(result[1].seen).toBe(true);
        expect(result[0].receiverUsername).toBe('receiver1');
        expect(result[1].receiverUsername).toBe('receiver1');
      });

      test('markNotificationsAsSeen should return an error if the provided user is invalid', async () => {
        const result = await markNotificationsAsSeen('invalidUser');
        expect(result).toEqual({
          error: 'Error when marking notifications as seen: Invalid username',
        });
      });

      test('markNotificationsAsSeen should return an error if the provided user is empty', async () => {
        const result = await markNotificationsAsSeen('');
        expect(result).toEqual({
          error: 'Error when marking notifications as seen: Invalid username',
        });
      });

      test('markNotificationsAsSeen should return an error if there is an error updating the notifications', async () => {
        mockingoose(UserModel).toReturn(USERS[0], 'findOne');
        mockingoose(NotificationModel).toReturn(new Error('Error performing update'), 'updateMany');

        const result = await markNotificationsAsSeen('invalidUser');
        expect(result).toEqual({
          error: 'Error when marking notifications as seen: Error performing update',
        });
      });

      test('markNotificationsAsSeen should return an error if there is an error finding relevant notifications', async () => {
        mockingoose(UserModel).toReturn(USERS[0], 'findOne');
        mockingoose(NotificationModel).toReturn(new Error('Error finding notifications'), 'find');

        const result = await markNotificationsAsSeen('invalidUser');
        expect(result).toEqual({
          error: 'Error when marking notifications as seen: Error finding notifications',
        });
      });
    });
    describe('getNotificationsForUser', () => {
      test('getNotificationsForUser should get all notifications for the specified user when no filter is provided', async () => {
        const expectedResults = notifications.filter(
          notif => notif.receiverUsername === 'receiver3',
        );

        mockingoose(UserModel).toReturn(USERS[3], 'findOne');
        mockingoose(NotificationModel).toReturn(expectedResults, 'find');

        NotificationModel.schema.path('eventId', Object);

        const result = (await getNotificationsForUser('receiver3')) as Notification[];

        expect(result).toHaveLength(4);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6de');
        expect(result[1]._id?.toString()).toEqual('91e9b58910afe6e94fc6e6de');
        expect(result[2]._id?.toString()).toEqual('91e9b58910afe6e94fc6e6de');
        expect(result[3]._id?.toString()).toEqual('91e9c58910afe6e94fc6e6de');
      });

      test('getNotificationsForUser should get filtered notifications for the specified user when the Answer filter is provided', async () => {
        const expectedResults = notifications.filter(
          notif => notif.receiverUsername === 'receiver3' && notif.notificationType === 'Answer',
        );

        mockingoose(UserModel).toReturn(USERS[3], 'findOne');
        mockingoose(NotificationModel).toReturn(expectedResults, 'find');

        NotificationModel.schema.path('eventId', Object);

        const result = (await getNotificationsForUser(
          'receiver3',
          NotificationType.ANSWER,
        )) as Notification[];

        expect(result).toHaveLength(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6de');
        expect(result[0].notificationType).toEqual('Answer');
        expect(result[0].receiverUsername).toEqual('receiver3');
      });

      test('getNotificationsForUser should get filtered notifications for the specified user when the Comment filter is provided', async () => {
        const expectedResults = notifications.filter(
          notif => notif.receiverUsername === 'receiver3' && notif.notificationType === 'Comment',
        );

        mockingoose(UserModel).toReturn(USERS[3], 'findOne');
        mockingoose(NotificationModel).toReturn(expectedResults, 'find');

        NotificationModel.schema.path('eventId', Object);

        const result = (await getNotificationsForUser(
          'receiver3',
          NotificationType.COMMENT,
        )) as Notification[];

        expect(result).toHaveLength(1);
        expect(result[0].notificationType).toEqual('Comment');
        expect(result[0].receiverUsername).toEqual('receiver3');
      });

      test('getNotificationsForUser should get filtered notifications for the specified user when the Badge filter is provided', async () => {
        const expectedResults = notifications.filter(
          notif => notif.receiverUsername === 'receiver3' && notif.notificationType === 'Badge',
        );

        mockingoose(UserModel).toReturn(USERS[3], 'findOne');
        mockingoose(NotificationModel).toReturn(expectedResults, 'find');

        NotificationModel.schema.path('eventId', Object);

        const result = (await getNotificationsForUser(
          'receiver3',
          NotificationType.BADGE,
        )) as Notification[];

        expect(result).toHaveLength(1);
        expect(result[0].notificationType).toEqual('Badge');
        expect(result[0].receiverUsername).toEqual('receiver3');
      });

      test('getNotificationsForUser should get filtered notifications for the specified user when the Follow filter is provided', async () => {
        const expectedResults = notifications.filter(
          notif => notif.receiverUsername === 'receiver3' && notif.notificationType === 'Follow',
        );

        mockingoose(UserModel).toReturn(USERS[3], 'findOne');
        mockingoose(NotificationModel).toReturn(expectedResults, 'find');

        NotificationModel.schema.path('eventId', Object);

        const result = (await getNotificationsForUser(
          'receiver3',
          NotificationType.FOLLOW,
        )) as Notification[];

        expect(result).toHaveLength(1);
        expect(result[0].notificationType).toEqual('Follow');
        expect(result[0].receiverUsername).toEqual('receiver3');
      });

      test('getNotificationsForUser should return an empty list if the user does not have any notifications', async () => {
        mockingoose(UserModel).toReturn(USERS[2], 'findOne');
        mockingoose(NotificationModel).toReturn([], 'find');

        const result = (await getNotificationsForUser('user2')) as Notification[];

        expect(result).toHaveLength(0);
        expect(result).toEqual([]);
      });

      test('getNotificationsForUser should return an error if the provided user is invalid', async () => {
        const result = await getNotificationsForUser('invalidUser');
        expect(result).toEqual({
          error: 'Error when getting notifications: Invalid username',
        });
      });

      test('getNotificationsForUser should return an error if the provided user is empty', async () => {
        const result = await getNotificationsForUser('');
        expect(result).toEqual({
          error: 'Error when getting notifications: Invalid username',
        });
      });

      test('getNotificationsForUser should return an error if there is an error retrieving the notifications', async () => {
        mockingoose(UserModel).toReturn(USERS[0], 'findOne');
        mockingoose(NotificationModel).toReturn(new Error('Error finding notifications'), 'find');

        const result = await getNotificationsForUser('test1');
        expect(result).toEqual({
          error: 'Error when getting notifications: Error finding notifications',
        });
      });

      test('getNotificationsForUser should return an error if there is an error finding the user', async () => {
        mockingoose(UserModel).toReturn(new Error('Error finding user'), 'findOne');

        const result = await getNotificationsForUser('invalidUser');
        expect(result).toEqual({
          error: 'Error when getting notifications: Error finding user',
        });
      });
    });

    describe('deleteNotifications', () => {
      test('deleteNotifications should delete the notifications of the specified user', async () => {
        mockingoose(UserModel).toReturn(USERS[0], 'findOne');
        mockingoose(NotificationModel).toReturn([], 'deleteMany');

        const result = await deleteNotificationsForUser('receiver1');

        expect(result).toEqual({ success: 'Notifications deleted successfully' });
      });

      test('deleteNotifications should return an error if the provided user is invalid', async () => {
        const result = await deleteNotificationsForUser('invalidUser');
        expect(result).toEqual({
          error: 'Error when deleting notifications: Invalid username',
        });
      });

      test('deleteNotifications should return an error if the provided user is empty', async () => {
        const result = await deleteNotificationsForUser('');
        expect(result).toEqual({
          error: 'Error when deleting notifications: Invalid username',
        });
      });

      test('deleteNotifications should return an error if there is an error deleting the notifications', async () => {
        mockingoose(UserModel).toReturn(USERS[0], 'findOne');
        mockingoose(NotificationModel).toReturn(new Error('Error performing delete'), 'deleteMany');

        const result = await deleteNotificationsForUser('invalidUser');
        expect(result).toEqual({
          error: 'Error when deleting notifications: Error performing delete',
        });
      });
    });
  });

  describe('Follow model', () => {
    const follows: Follow[] = [
      {
        _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
        followerUsername: 'user1',
        followeeUsername: 'user2',
        followDateTime: new Date('2023-11-19T09:24:00'),
      },
      {
        _id: new ObjectId('65e9b58910afe6e94fc6e7de'),
        followerUsername: 'user2',
        followeeUsername: 'user1',
        followDateTime: new Date('2023-11-19T09:24:00'),
      },
    ];
    describe('addFollow', () => {
      test('addFollow should create a new follow request if both users exist and the follower is not already following the followee.', async () => {
        mockingoose(UserModel).toReturn([USERS[1], USERS[2]], 'findOne');
        mockingoose(FollowModel).toReturn(null, 'findOne');
        const result = (await addFollow({
          followerUsername: 'user1',
          followeeUsername: 'user2',
          followDateTime: new Date('2023-11-19T09:24:00'),
        })) as FollowResponse;

        expect(result).toEqual({ success: 'Follow request created' });
      });

      test('addFollow should delete a new follow request if both users exist and the followeer is already following the followee.', async () => {
        mockingoose(UserModel).toReturn([USERS[1], USERS[2]], 'findOne');
        mockingoose(FollowModel).toReturn(follows[0], 'findOne');

        const result = (await addFollow({
          followerUsername: 'user1',
          followeeUsername: 'user2',
          followDateTime: new Date('2023-11-19T09:24:00'),
        })) as FollowResponse;

        expect(result).toEqual({ success: 'Follow request deleted' });
      });

      test('addFollow should return an error if a given user does not exist.', async () => {
        mockingoose(UserModel).toReturn(
          new Error('Follower or followee does not exist'),
          'findOne',
        );

        const result = (await addFollow({
          followerUsername: 'user1',
          followeeUsername: 'user2',
          followDateTime: new Date('2023-11-19T09:24:00'),
        })) as {
          error: string;
        };

        expect(result.error).toEqual('Error when creating or deleting a follow request');
      });

      test('addFollow should return an error if there is an error finding a follow object.', async () => {
        mockingoose(UserModel).toReturn([USERS[1], USERS[2]], 'findOne');
        mockingoose(FollowModel).toReturn(new Error('Error retrieivng follow request'), 'findOne');

        const result = (await addFollow({
          followerUsername: 'user1',
          followeeUsername: 'user2',
          followDateTime: new Date('2023-11-19T09:24:00'),
        })) as {
          error: string;
        };

        expect(result.error).toEqual('Error when creating or deleting a follow request');
      });
    });
  });

  describe('getFollowersAndFollowingForUser', () => {
    it('should return an error if the user does not exist', async () => {
      jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);

      const result = await getFollowersAndFollowingForUser('nonExistentUser');

      expect(result).toEqual({
        error: 'Error when getting followers and following: Invalid username',
      });
    });

    it('should return followers and following for a valid user', async () => {
      const mockFollowers = [
        {
          followerUsername: 'follower1',
          followeeUsername: 'johnDoe',
          followDateTime: new Date('2023-11-19T09:24:00'),
        },
        {
          followerUsername: 'follower2',
          followeeUsername: 'johnDoe',
          followDateTime: new Date('2023-11-19T09:24:00'),
        },
      ];

      const mockFollowing = [
        {
          followerUsername: 'john',
          followeeUsername: 'following1',
          followDateTime: new Date('2023-11-19T09:24:00'),
        },
        {
          followerUsername: 'john',
          followeeUsername: 'following2',
          followDateTime: new Date('2023-11-19T09:24:00'),
        },
      ];

      jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce({ username: 'johnDoe' });

      const createMockQuery = (resolvedValue: Follow[]) =>
        ({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(resolvedValue),
        }) as unknown as Query<Follow[], Follow>;

      jest.spyOn(FollowModel, 'find').mockImplementationOnce(() => createMockQuery(mockFollowers));
      jest.spyOn(FollowModel, 'find').mockImplementationOnce(() => createMockQuery(mockFollowing));

      const result = await getFollowersAndFollowingForUser('johnDoe');

      expect(result).toEqual({
        followers: mockFollowers,
        following: mockFollowing,
      });
    });

    it('should return an error if there is a database issue', async () => {
      jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const result = await getFollowersAndFollowingForUser('johnDoe');

      expect(result).toEqual({
        error: 'Error when getting followers and following: Database error',
      });
    });
  });

  describe('getFeedForUser', () => {
    beforeAll(() => {
      mockingoose.resetAll();
    });

    beforeEach(() => {
      mockingoose.resetAll();
      jest.clearAllMocks();
    });

    test('should return an error if the user does not exist', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');

      const result = await getFeedForUser('nonExistentUser');

      expect(result).toEqual({ error: 'Error when getting feed: Invalid username' });
    });

    test('should return a feed with all types of posts for a valid user', async () => {
      mockingoose(UserModel).toReturn(feedUser, 'findOne');
      mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
      mockingoose(QuestionModel).toReturn([populatedQuestion1], 'find');
      mockingoose(AnswerModel).toReturn([populatedAnswer1], 'find');
      mockingoose(CommentModel).toReturn([populatedComment1], 'find');
      const feedPosts = await getFeedForUser('user1');
      expect(Array.isArray(feedPosts)).toBe(true);
      const posts = feedPosts as FeedPost[];
      expect(posts.length).toBe(5);
    });

    test('should return a feed with only questions asked when the question filter is applied', async () => {
      mockingoose(UserModel).toReturn(feedUser, 'findOne');
      mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
      mockingoose(QuestionModel).toReturn([populatedQuestion1], 'find');

      const feedPosts = await getFeedForUser('user1', FeedPostType.QUESTION);

      expect(Array.isArray(feedPosts)).toBe(true);
      const posts = feedPosts as FeedPost[];
      expect(posts.length).toBe(1);
      expect(posts[0].postType).toEqual(FeedPostType.QUESTION);
    });

    test('should return an error if there is an error fetching questions asked', async () => {
      mockingoose(UserModel).toReturn(feedUser, 'findOne');
      mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
      mockingoose(QuestionModel).toReturn(new Error('Error fetching questions'), 'find');

      const result = await getFeedForUser('user1', FeedPostType.QUESTION);

      expect(result).toEqual({ error: 'Error when getting feed: Error fetching questions' });
    });
    test('should return a feed with only questions answered when the answer filter is applied', async () => {
      mockingoose(UserModel).toReturn(feedUser, 'findOne');
      mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
      mockingoose(AnswerModel).toReturn([populatedAnswer1], 'find');
      mockingoose(QuestionModel).toReturn([populatedAnswer1], 'find');

      const feedPosts = await getFeedForUser('user1', FeedPostType.ANSWER);

      expect(Array.isArray(feedPosts)).toBe(true);
      const posts = feedPosts as FeedPost[];
      expect(posts.length).toBe(1);
      expect(posts[0].postType).toEqual(FeedPostType.ANSWER);
    });

    test('should return an error if there is an error fetching questions answered', async () => {
      mockingoose(UserModel).toReturn(feedUser, 'findOne');
      mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
      mockingoose(AnswerModel).toReturn(new Error('Error fetching answers'), 'find');

      const result = await getFeedForUser('user1', FeedPostType.ANSWER);

      expect(result).toEqual({ error: 'Error when getting feed: Error fetching answers' });
    });

    test('should return a feed with only comments posted when the comment filter is applied', async () => {
      mockingoose(UserModel).toReturn(feedUser, 'findOne');
      mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
      mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
      mockingoose(CommentModel).toReturn([populatedComment1], 'find');

      const feedPosts = await getFeedForUser('user1', FeedPostType.COMMENT);

      expect(Array.isArray(feedPosts)).toBe(true);
      const posts = feedPosts as FeedPost[];
      expect(posts.length).toBe(1);
      expect(posts[0].postType).toEqual(FeedPostType.COMMENT);
    });

    test('should return an error if there is an error fetching comments posted', async () => {
      mockingoose(UserModel).toReturn(feedUser, 'findOne');
      mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
      mockingoose(CommentModel).toReturn(new Error('Error fetching comments'), 'find');

      const result = await getFeedForUser('user1', FeedPostType.COMMENT);

      expect(result).toEqual({ error: 'Error when getting feed: Error fetching comments' });
    });

    test('should return a feed with only follow events when the follow filter is applied', async () => {
      mockingoose(UserModel).toReturn(feedUser, 'findOne');
      mockingoose(FollowModel).toReturn(FOLLOWS, 'find');

      const feedPosts = await getFeedForUser('user1', FeedPostType.FOLLOW);

      expect(Array.isArray(feedPosts)).toBe(true);
      const posts = feedPosts as FeedPost[];
      expect(posts.length).toBe(4);
      for (const post of posts) {
        expect(post.postType).toEqual(FeedPostType.FOLLOW);
      }
    });

    test('should return an error if there is an error fetching follows', async () => {
      mockingoose(UserModel).toReturn(feedUser, 'findOne');
      mockingoose(FollowModel).toReturn(new Error('Error fetching follows'), 'find');

      const result = await getFeedForUser('user1', FeedPostType.FOLLOW);

      expect(result).toEqual({ error: 'Error when getting feed: Error fetching follows' });
    });
  });

  test('should return a feed sorted from most to least recent', async () => {
    mockingoose(UserModel).toReturn(feedUser, 'findOne');
    mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
    mockingoose(QuestionModel).toReturn([populatedQuestion1], 'find');
    mockingoose(AnswerModel).toReturn([populatedAnswer1], 'find');
    mockingoose(CommentModel).toReturn([populatedComment1], 'find');

    const feedPosts = await getFeedForUser('user1');

    expect(Array.isArray(feedPosts)).toBe(true);
    const posts = feedPosts as FeedPost[];
    expect(posts.length).toBe(5);
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].date.getSeconds()).toBeGreaterThanOrEqual(posts[i + 1].date.getSeconds());
    }
  });
});
