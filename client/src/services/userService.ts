import { Follows, User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Adds a new answer to a specific question.
 *
 * @param qid - The ID of the question to which the answer is being added.
 * @param ans - The answer object containing the answer details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addUser = async (
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
const getUser = async (username: string): Promise<User> => {
  const res = await api.get(`${USER_API_URL}/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching user');
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
const getFollowers = async (username: string): Promise<Follows> => {
  const res = await api.get(`${USER_API_URL}/follow/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching follows');
  }
  return res.data;
};
export { addUser, getUser, getFollowers };
