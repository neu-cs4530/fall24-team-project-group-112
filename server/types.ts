import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Interface representing a User, which contains:
 * - username - The unique identifier of the user.
 * - firstName - The user's first name
 * - lastName - The user's last name
 * - email - The user's email address
 * - headline? - The user's one-liner headline. Optional field.
 * - bio? - The user's full bio. Optional field.
 * - githubUrl? - The user's GitHub profile. Optional field.
 * - company? - The company a user currently works at. Optional field.
 * - school? - The school a user currently attends. Optional field.
 * - city? - The city a user lives in. Optional field.
 * - state? - The country a user lives in. Optional field.
 * - badges - The list of badges a user has earned.
 * - avatarName? - The name of the user's avatar image. Optional field.
 * - createdAt - The date the user created their account.
 *
 */
export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  headline?: string;
  bio?: string;
  githubUrl?: string;
  company?: string;
  school?: string;
  city?: string;
  state?: string;
  badges: Badge[];
  avatarName?: string;
  createdAt: Date;
}

/**
 * Interface extending the request body when updating a user's profile, which contains a
 * username parameter and UpdateUserPayload body containing updated profile information.
 */
export interface UpdateUserRequest extends Request {
  params: {
    username: string;
  };
  body: UpdateUserPayload;
}

/**
 * Interface for updating a user's profile, which contains:
 * - headline - The user's one-liner headline. Optional field.
 * - bio - The user's full bio. Optional field.
 * - githubUrl - The user's GitHub profile. Optional field.
 * - company - The company a user currently works at. Optional field.
 * - school - The school a user currently attends. Optional field.
 * - city - The city a user lives in. Optional field.
 * - state - The country a user lives in. Optional field.
 * - avatarName - The name of the user's avatar image. Optional field.
 */
export interface UpdateUserPayload {
  headline?: string;
  bio?: string;
  githubUrl?: string;
  company?: string;
  school?: string;
  city?: string;
  state?: string;
  avatarName?: string;
}

// TODO: fill in interface details
export interface Badge {}

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of usernames that have viewed the question.
 * - upVotes - An array of usernames that have upvoted the question.
 * - downVotes - An array of usernames that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: string;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };

/**
 * Interface representing a Follow, which contains:
 * - _id - The unique identifier for the follower. Optional field.
 * - followerUsername - The username of the user who followed a user.
 * - followeeUsername - The username of the user who was followed by a user.
 * - followDateTime - The date and time when the follow was posted.
 *
 */
export interface Follow {
  _id?: ObjectId;
  followerUsername: string;
  followeeUsername: string;
  followDateTime: Date;
}

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update event, which contains:
 * - qid - The unique identifier of the question.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
}

/**
 * Enum representing the possible event types for notifications.
 */
export enum NotificationType {
  ANSWER = 'answer',
  COMMENT = 'comment',
  BADGE = 'badge',
  FOLLOW = 'follow',
}

/**
 * Interface representing a Notification, which contains:
 * - _id: The unique identifier for the notification.
 * - notificationType: The type of notification, one of NotificationType.
 * - eventId: The unique identifier of the event that triggered the notification.
 * - receiverUsername: The username of the user who will receive the notification.
 * - notificationDate: The date and time when the notification was created.
 * - seen: A boolean value indicating whether the notification has been seen by the user.
 */
export interface Notification {
  _id?: ObjectId;
  notificationType: NotificationType;
  eventId: ObjectId;
  receiverUsername: string;
  notificationDate: Date;
  seen: boolean;
}

/**
 * Type representing the possible responses for a User-related operation.
 */
export type UserResponse = User | { error: string };

/**
 * Interface extending the request body when creating a new user, which contains:
 * - user - The user being created.
 * - password - The password for the user (to be used to create a Firebase user object only).
 */
export interface CreateUserRequest extends Request {
  body: {
    user: User;
    password: string;
  };
}

/**
 * Interface for the request parameters when finding questions asked by a given user.
 * - username - The user's unique username.
 */
export interface FindQuestionsAskedByRequest extends Request {
  params: {
    username: string;
  };
}

/**
 * Interface extending the request body when logging in an existing user, which contains:
 * - email - The email of the user.
 * - password - The password of the user.
 */
export interface LoginUserRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

/**
 * Enum representing the possible colors for a badge.
 */
export enum BadgeColor {
  Gold = 'gold',
  Silver = 'silver',
  Bronze = 'bronze',
}

/**
 * Enum representing the possible types of badges.
 */
export enum BadgeName {
  FirstCommenter = 'First Commenter',
  Voter = 'Voter',
  DiscussionStarter = 'Discussion Starter',
  CommunityHelper = 'Community Helper',
  Influencer = 'Influencer',
  Lifesaver = 'Lifesaver',
}

/**
 * Interface representing a Badge, which contains:
 * - _id - The unique identifier for the badge. Optional field.
 * - name - The name of the badge.
 * - description - The description of the badge.
 * - color - The color of the badge.
 */
export interface Badge {
  _id?: ObjectId;
  name: BadgeName;
  description: string;
  color: BadgeColor;
}

/**
 * Interface extending the request body when creating a new follow request, which contains:
 * - followerUsername - The username of the user following another user.
 * - followeeUsername - The username of the user being followed.
 */
export interface FollowRequest extends Request {
  body: {
    followerUsername: string;
    followeeUsername: string;
  };
}

/**
 * Type representing the possible responses for a Follow-related operation.
 */
export type FollowResponse = { success: string } | { error: string };
