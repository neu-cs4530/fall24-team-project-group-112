import { Question } from '../types';
import api from './config';

const QUESTION_API_URL = `${process.env.REACT_APP_SERVER_URL}/question`;

/**
 * Function to get questions by filter.
 *
 * @param order - The order in which to fetch questions. Default is 'newest'.
 * @param search - The search term to filter questions. Default is an empty string.
 * @throws Error if there is an issue fetching or filtering questions.
 */
const getQuestionsByFilter = async (
  order: string = 'newest',
  search: string = '',
): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering questions');
  }
  return res.data;
};

/**
 * Function to get a question by its ID.
 *
 * @param qid - The ID of the question to retrieve.
 * @param username - The username of the user requesting the question.
 * @throws Error if there is an issue fetching the question by ID.
 */
const getQuestionById = async (qid: string, username: string): Promise<Question> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching question by id');
  }
  return res.data;
};

/**
 * Function to add a new question.
 *
 * @param q - The question object to add.
 * @throws Error if there is an issue creating the new question.
 */
const addQuestion = async (q: Question): Promise<Question> => {
  const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

  if (res.status !== 200) {
    throw new Error('Error while creating a new question');
  }

  return res.data;
};

/**
 * Function to upvote a question.
 *
 * @param qid - The ID of the question to upvote.
 * @param username - The username of the person upvoting the question.
 * @throws Error if there is an issue upvoting the question.
 */
const upvoteQuestion = async (qid: string, username: string) => {
  const data = { qid, username };
  const res = await api.post(`${QUESTION_API_URL}/upvoteQuestion`, data);
  if (res.status !== 200) {
    throw new Error('Error while upvoting the question');
  }
  return res.data;
};

/**
 * Function to downvote a question.
 *
 * @param qid - The ID of the question to downvote.
 * @param username - The username of the person downvoting the question.
 * @throws Error if there is an issue downvoting the question.
 */
const downvoteQuestion = async (qid: string, username: string) => {
  const data = { qid, username };
  const res = await api.post(`${QUESTION_API_URL}/downvoteQuestion`, data);
  if (res.status !== 200) {
    throw new Error('Error while downvoting the question');
  }
  return res.data;
};

/**
 * Function to get questions asked by a user.
 *
 * @param username - The username of the user who's information we need.
 * @throws Error if there is an issue fetching questions asked by the user.
 */
const getQuestionsAskedBy = async (username: string): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/askedBy/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching questions asked by user');
  }
  return res.data;
};

/**
 * Function to get questions answered by a user.
 *
 * @param username - The username of the user who's information we need.
 * @throws Error if there is an issue fetching questions answered by the user.
 */
const getQuestionsAnsweredBy = async (username: string): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/answeredBy/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching questions answered by user');
  }
  return res.data;
};

/**
 * Function to get questions downvoted by a user.
 *
 * @param username - The username of the user who's information we need.
 * @throws Error if there is an issue fetching questions downvoted by the user.
 */
const getQuestionsDownvotedBy = async (username: string): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/downvotedBy/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching questions downvoted by user');
  }
  return res.data;
};

/**
 * Function to get questions upvoted by a user.
 *
 * @param username - The username of the user who's information we need.
 * @throws Error if there is an issue fetching questions upvoted by the user.
 */
const getQuestionsUpvotedBy = async (username: string): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/upvotedBy/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching questions upvoted by user');
  }
  return res.data;
};

export {
  getQuestionsByFilter,
  getQuestionById,
  addQuestion,
  upvoteQuestion,
  downvoteQuestion,
  getQuestionsAskedBy,
  getQuestionsAnsweredBy,
  getQuestionsDownvotedBy,
  getQuestionsUpvotedBy,
};
