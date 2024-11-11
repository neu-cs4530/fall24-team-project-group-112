import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;
const LOGIN_API_URL = `${process.env.REACT_APP_SERVER_URL}/user/login`;

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
