import express, { Response, Router } from 'express';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { CreateUserRequest, User, FindUserRequest } from '../types';
import { addUser, isUsernameUnique } from '../models/application';
import { auth } from '../firebaseConfig';
import UserModel from '../models/user';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Checks if the provided user request contains the required data.
   *
   * @param req The request object containing the user data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: CreateUserRequest): boolean {
    return !!req.body.user && !!req.body.password;
  }

  /**
   * Checks if the provided user request contains the required fields and if the email is valid.
   *
   * @param req The request object containing the user data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isUserValid(user: User): boolean {
    if (
      !!user.username &&
      !!user.firstName &&
      !!user.lastName &&
      !!user.email &&
      !!user.createdAt
    ) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validEmail = emailRegex.test(user.email);

      return validEmail;
    }

    return false;
  }

  /**
   * Creates a new user object with the given username, first name, last name, and email.
   * Creates a corresponding user object in firebase with the username, email and password.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The HTTP request object (not used in this function).
   * @param res The HTTP response object used to send back the tag count mapping.
   *
   * @returns A Promise that resolves to void.
   */
  const createUser = async (req: CreateUserRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    if (!isUserValid(req.body.user)) {
      res.status(400).send('Invalid user');
      return;
    }

    if (!(await isUsernameUnique(req.body.user.username))) {
      res.status(400).send('Username already exists, choose a unique username');
      return;
    }

    const { user } = req.body;

    try {
      // Create MongoDB user
      const newUser = await addUser(user);

      // Create firebase user
      await createUserWithEmailAndPassword(auth, user.email, req.body.password);

      if ('error' in newUser) {
        throw new Error(newUser.error as string);
      }
      res.json(newUser);
    } catch (err) {
      res.status(500).send(`Error when creating a user: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a user's public details.
   *
   * @param req The HTTP request object containing the username parameter.
   * @param res The HTTP response object used to send back the user's public details.
   *
   * @returns A Promise that resolves to void.
   */
  const getUser = async (req: FindUserRequest, res: Response): Promise<void> => {
    try {
      const { user } = req.body;
      // const user = await UserModel.findOne({ username });

      if (!user) {
        res.status(404).send(`User with username "${user.username}" not found`);
      } else {
        res.json(user); // Return the user as JSON
      }
    } catch (err) {
      res.status(500).send(`Error retrieving user: ${(err as Error).message}`);
    }
  };

  // Add appropriate HTTP verbs and their endpoints to the router.
  router.post('', createUser);
  router.get('/getUser/:username', getUser); // New endpoint to get user by username

  return router;
};

export default userController;
