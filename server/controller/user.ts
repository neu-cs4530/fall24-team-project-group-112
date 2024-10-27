import express, { Response } from 'express';
import { FakeSOSocket, UpdateUserRequest, User } from '../types';

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Updates a user's profile information with the provided information.
   *
   * @param req The FindQuestionRequest object containing the query parameters `order` and `search`.
   * @param res The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  const updateProfile = async (req: UpdateUserRequest, res: Response): Promise<void> => {
    const { headline, bio, githubUrl, company, school, city, state, avatarName } = req.body;
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.patch('/', updateProfile);

  return router;
};

export default userController;
