import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents>;
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
 * Interface representing a Badge, which contains:
 * - _id - The unique identifier for the badge. Optional field.
 * - name - The name of the badge.
 * - description - The description of the badge.
 * - color - The color of the badge.
 */
export interface Badge {
  _id?: string;
  name: BadgeName;
  description: string;
  color: BadgeColor;
}
/**
 * Enum representing the possible colors for a badge.
 */
export enum BadgeColor {
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
}
/**
 * Enum representing the possible types of badges.
 */
export enum BadgeName {
  FIRST_COMMENTER = 'First Commenter',
  VOTER = 'Voter',
  DISCUSSION_STARTER = 'Discussion Starter',
  COMMUNITY_HELPER = 'Community Helper',
  INFLUENCER = 'Influencer',
  LIFESAVER = 'Lifesaver',
}
/**
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;
/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;
/**
 * Interface represents a comment.
 *
 * text - The text of the comment.
 * commentBy - Username of the author of the comment.
 * commentDateTime - Time at which the comment was created.
 */
export interface Comment {
  text: string;
  commentBy: string;
  commentDateTime: Date;
}
/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
export interface Tag {
  _id?: string;
  name: string;
  description: string;
}
/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}
/**
 * Interface representing the voting data for a question, which contains:
 * - qid - The ID of the question being voted on
 * - upVotes - An array of user IDs who upvoted the question
 * - downVotes - An array of user IDs who downvoted the question
 */
export interface VoteData {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}
/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Comments associated with the answer.
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[];
}
/**
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - An array of usernames who viewed the question.
 * - text - The content of the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - The date and time when the question was asked.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 * - comments - Comments associated with the question.
 */
export interface Question {
  _id?: string;
  tags: Tag[];
  answers: Answer[];
  title: string;
  views: string[];
  text: string;
  askedBy: string;
  askDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
}
/**
 * Interface representing the payload for a vote update socket event.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}
export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
}
export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

export interface Follow {
  followerUsername: string;
  followeeUsername: string;
  followDateTime: Date;
  user: User;
}

export interface Follows {
  followers: Follow[];
  following: Follow[];
}

/**
 * Interface representing the payload for a notification update event, which contains:
 * - username - The username of which the notification is for.
 * - type - The type of notificiation, either comment, answer, badge, or follow.
 */
export interface NotificationUpdatePayload {
  notification: Notification;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: Question) => void;
  answerUpdate: (update: AnswerUpdatePayload) => void;
  viewsUpdate: (question: Question) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (update: CommentUpdatePayload) => void;
  notificationUpdate: (notification: NotificationUpdatePayload) => void;
  profileUpdate: (update: User) => void;
  followUpdate: (follow: string) => void;
}

/**
 * Enum representing the possible event types for notifications.
 */
export enum NotificationType {
  ANSWER = 'Answer',
  COMMENT = 'Comment',
  BADGE = 'Badge',
  FOLLOW = 'Follow',
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
  _id?: string;
  notificationType: NotificationType;
  eventId: Answer | Comment | Badge | Follow;
  questionId?: Question;
  receiverUsername: string;
  notificationDate: Date;
  seen: boolean;
  profileUpdate: (update: User) => void;
  followUpdate: (follow: string) => void;
}

/**
 * Enum representing the avatars a user can choose from.
 */
export enum AvatarNames {
  AVATAR_1 = 'avatar1',
  AVATAR_2 = 'avatar2',
  AVATAR_3 = 'avatar3',
  AVATAR_4 = 'avatar4',
  AVATAR_5 = 'avatar5',
}

/**
 * Interface for updating a user's profile, which contains:
 * - firstName - The user's first name. Optional field.
 * - lastName - The user's last name. Optional field.
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
  firstName?: string;
  lastName?: string;
  headline?: string;
  bio?: string;
  githubUrl?: string;
  company?: string;
  school?: string;
  city?: string;
  state?: string;
  avatarName?: string;
}

/**
 * Enum representing the possible event types for feed posts.
 */
export enum FeedPostType {
  QUESTION = 'Question',
  ANSWER = 'Answer',
  COMMENT = 'Comment',
  FOLLOW = 'Follow',
}

/**
 * Interface representing a Feed item, which contains:
 * - _id: The unique identifier for the feed.
 * - postType: The type of feed item, one of FeedPostType.
 * - event: The unique identifier of the event that triggered the feed item.
 */

export interface FeedPost {
  _id?: string;
  postType: FeedPostType;
  event: string | Question | Answer | Comment | Follow;
  date: Date;
}
