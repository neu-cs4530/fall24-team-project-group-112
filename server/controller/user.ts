import express, { Response, Router } from 'express';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { CreateUserRequest, LoginUserRequest, User } from '../types';
import { addUser, isUsernameUnique } from '../models/application';
import { auth } from '../firebaseConfig';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Checks if the provided user request contains the required data.
   *
   * @param req The request object containing the user data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isUserRequestValid(req: CreateUserRequest): boolean {
    return !!req.body.user && !!req.body.password;
  }

  /**
   * Checks if the provided login request contains the required data.
   *
   * @param req The request object containing the login data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isLoginRequestValid(req: LoginUserRequest): boolean {
    return !!req.body.email && !!req.body.password;
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
    if (!isUserRequestValid(req)) {
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
   * Logs in a user with the given email and password.
   *
   * If the user does not exist or login fails, the HTTP response's status is updated.
   *
   * @param req The HTTP request object (not used in this function).
   * @param res The HTTP response object used to send back the tag count mapping.
   *
   * @returns A Promise that resolves to void.
   */
  const loginUser = async (req: LoginUserRequest, res: Response): Promise<void> => {
    if (!isLoginRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { email } = req.body;

    try {
      await signInWithEmailAndPassword(auth, email, req.body.password);

      res.json(email);
    } catch (err) {
      res.status(500).send(`Login error: ${(err as Error).message}`);
    }
  };
  // Add appropriate HTTP verbs and their endpoints to the router.
  router.post('', createUser);
  router.get('/login', loginUser);

  return router;
};

export default userController;
