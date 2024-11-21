import { FeedPost, Follows, UpdateUserPayload, User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;
const LOGIN_API_URL = `${process.env.REACT_APP_SERVER_URL}/user/login`;
const LOGOUT_API_URL = `${process.env.REACT_APP_SERVER_URL}/user/logout`;
const FEED_API_URL = `${process.env.REACT_APP_SERVER_URL}/user/feed`;

/**
 * Adds a new answer to a specific question.
 *
 * @param qid - The ID of the question to which the answer is being added.
 * @param ans - The answer object containing the answer details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
export const addUser = async (
  user: User,
  password: string,
): Promise<User | { status: number; error: string }> => {
  const data = { user, password };

  const res = await api.post(`${USER_API_URL}`, data);
  if (res.status !== 200) {
    return { status: res.status, error: res.statusText };
  }
  return res.data;
};

/**
 * Gets a user given a specific username.
 *
 * @param username - The username of the user to be retrieved.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 * @returns The user object.
 */
export const getUser = async (username: string): Promise<User> => {
  const res = await api.get(`${USER_API_URL}/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching user');
  }
  return res.data;
};

/**
 * Logs in a user with the given email and password.
 *
 * @param email - The email of the user logging in.
 * @param password - The password of the user logging in.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
export const loginUser = async (
  email: string,
  password: string,
): Promise<User | { status: number; error: string }> => {
  const data = { email, password };

  try {
    const res = await api.post(`${LOGIN_API_URL}`, data);
    return res.data;
  } catch (error: unknown) {
    return {
      status: 500,
      error: 'An unexpected error occurred',
    };
  }
};

/**
 * Logs out a user with the given email.
 *
 * @param email - The email of the user logging out.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
export const logoutUser = async (): Promise<{ status: number; error: string }> => {
  try {
    const res = await api.post(`${LOGOUT_API_URL}`);
    return res.data;
  } catch (error: unknown) {
    return {
      status: 500,
      error: 'There was an error logging out. Please try again.',
    };
  }
};

/**
 * Updates a user's information with the given information.
 *
 * @param username - The username of the user to be updated.
 * @param userPayload - The user payload object containing the updated user details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 * @returns The updated user object.
 */
export const updateProfile = async (
  username: string,
  userPayload: UpdateUserPayload,
): Promise<{ user: User; notification: Notification | undefined }> => {
  const res = await api.patch(`${USER_API_URL}/${username}`, userPayload);
  if (res.status !== 200) {
    throw new Error('Error while updating user');
  }
  return res.data;
};

/**
 * Gets a user's followers and following given a specific username.
 *
 * @param username - The username of the user whose followers/following are to be retrieved.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 * @returns an object containing an array of follower usernames and following usernames.
 */
export const getFollowers = async (username: string): Promise<Follows> => {
  const res = await api.get(`${USER_API_URL}/follow/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching follows');
  }
  return res.data;
};

/**
 * Adds or deletes a follow relationship given a specific follower username and followee username.
 *
 * @param followerUsername - The username of the user who is issuing a follow.
 * @param followeeUsername - The username of the user who is being followed.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 * @returns a success or error message depending on the succesful addition or deletion of the follow.
 */
export const addFollow = async (
  followerUsername: string,
  followeeUsername: string,
): Promise<{ success: string } | { error: string }> => {
  const data = { followerUsername, followeeUsername };

  const res = await api.post(`${USER_API_URL}/follow`, data);
  if (res.status !== 200) {
    throw new Error('Error while adding or deleting follows');
  }
  return res.data;
};

/**
 * Function to get all feed items for a user.
 *
 * @param username - The username of the user whose feed items are being retrieved.
 * @param type - (Optional) The type of feed item to filter by.
 * @throws Error if there is an issue fetching the feed items.
 */
export const getFeed = async (username: string, type?: string): Promise<FeedPost[]> => {
  let url = `${FEED_API_URL}/${username}`;
  if (type) {
    url += `?postType=${type}`;
  }

  const res = await api.get(url);

  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering feed items');
  }

  return res.data;
};

/**
 * Function to get follow recommendations for a user.
 *
 * @param username - The username of the user whose follow recommendations are being retrieved.
 * @throws Error if there is an issue fetching recommendations.
 */
export const getFollowRecommendations = async (username: string): Promise<User[]> => {
  const url = `${USER_API_URL}/follow/recommendations/${username}`;

  const res = await api.get(url);
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering feed items');
  }

  return res.data;
};
