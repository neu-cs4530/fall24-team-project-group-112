import express, { Response, Router } from 'express';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {
  FakeSOSocket,
  UpdateUserRequest,
  CreateUserRequest,
  LoginUserRequest,
  FollowRequest,
  User,
  UpdateUserPayload,
  FindFollowersAndFollowingRequest,
  FindUserRequest,
} from '../types';
import {
  addUser,
  isUsernameUnique,
  updateUser,
  addFollow,
  getFollowersAndFollowingForUser,
  getFeedForUser,
} from '../models/application';
import { auth } from '../firebaseConfig';
import UserModel from '../models/users';

const userController = (socket: FakeSOSocket) => {
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
   * Checks if the provided follow request contains the required data.
   *
   * @param req The request object containing the follow data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isFollowRequestValid(req: FollowRequest): boolean {
    return !!req.body.followerUsername && !!req.body.followeeUsername;
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
   * Retrieves a user's public details through their username.
   *
   * @param req The HTTP request object containing the username parameter.
   * @param res The HTTP response object used to send back the user's public details.
   *
   * @returns A Promise that resolves to void.
   */
  const getUserByUsername = async (req: FindUserRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const user = await UserModel.findOne({ username });

      if (!user) {
        res.status(404).send(`User with the username "${username}" not found`);
      } else {
        res.json(user); // Return the user as JSON
      }
    } catch (err) {
      res.status(500).send(`Error when fetching user: ${(err as Error).message}`);
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

  /**
   * Updates a user's profile information with the provided information.
   *
   * @param req The UpdateUserRequest object containing the username and the updated user information.
   * @param res The HTTP response object used to send back the updated user information.
   *
   * @returns A Promise that resolves to void.
   */
  const updateProfile = async (req: UpdateUserRequest, res: Response): Promise<void> => {
    const { username } = req.params;
    const userUpdate: UpdateUserPayload = { ...req.body };

    try {
      const updatedUser = await updateUser(username, userUpdate);

      if (updatedUser && 'error' in updatedUser) {
        throw new Error(updatedUser.error);
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(500).send(`Error when updating user profile: ${(err as Error).message}`);
    }
  };

  /**
   * Creates a new follow record with the given follower and followee if one does not already exist.
   * If a follow record already exists, deletes it from the database.
   *
   * @param req The FollowRequest object containing the follower and followee username.
   * @param res The HTTP response object with a message saying if the user was followed or unfollowed.
   *
   * @returns A Promise that resolves to void.
   */
  const createFollow = async (req: FollowRequest, res: Response): Promise<void> => {
    if (!isFollowRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { followerUsername, followeeUsername } = req.body;

    try {
      const follow = {
        followerUsername,
        followeeUsername,
        followDateTime: new Date(),
      };
      const response = await addFollow(follow);

      if (response && 'error' in response) {
        throw new Error(response.error);
      }

      res.json(response);
    } catch (err) {
      res
        .status(500)
        .send(`Error when creating/deleting follow request: ${(err as Error).message}`);
    }
  };

  /**
   * Gets all followers and following for a given user
   * If the provided user is invalid, an error will be returned.
   *
   * @param req The request object containing the username as a parameter.
   * @param res The HTTP response object used to send back the user's followers and following.
   */
  const getFollowersAndFollowing = async (
    req: FindFollowersAndFollowingRequest,
    res: Response,
  ): Promise<void> => {
    const { username } = req.params;

    try {
      const result = await getFollowersAndFollowingForUser(username);

      if (result && 'error' in result) {
        throw new Error(result.error);
      }

      res.status(200).json(result);
    } catch (err: unknown) {
      res
        .status(500)
        .send(`Error when fetching followers and following: ${(err as Error).message}`);
    }
  };

  const getFeed = async (req: FindUserRequest, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
      const result = await getFeedForUser(username);

      if (result && 'error' in result) {
        throw new Error(result.error);
      }

      res.status(200).json(result);
    } catch (err: unknown) {
      res.status(500).send(`Error when fetching user feed: ${(err as Error).message}`);
    }
  };

  router.post('', createUser);
  router.post('/login', loginUser);
  router.get('/:username', getUserByUsername);
  router.patch('/:username', updateProfile);
  router.post('/follow', createFollow);
  router.get('/follow/:username', getFollowersAndFollowing);
  router.get('/feed/:username', getFeed);

  return router;
};

export default userController;
