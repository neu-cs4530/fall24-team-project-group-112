import express, { Response, Router } from 'express';
import { FakeSOSocket, AddBadgeRequest } from '../types';
import { addBadge } from '../models/application';

const badgeController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  /**
   * Checks if the provided follow request contains the required data.
   *
   * @param req The request object containing the follow data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isBadgeRequestValid(req: AddBadgeRequest): boolean {
    return !!req.params.username && !!req.params.badgeId;
  }

  /**
   * Creates a new follow record with the given follower and followee if one does not already exist.
   * If a follow record already exists, deletes it from the database.
   *
   * @param req The FollowRequest object containing the follower and followee username.
   * @param res The HTTP response object with a message saying if the user was followed or unfollowed.
   *
   * @returns A Promise that resolves to void.
   */
  const addBadgeToUser = async (req: AddBadgeRequest, res: Response): Promise<void> => {
    if (!isBadgeRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { badgeId, username } = req.params;

    try {
      const response = await addBadge(badgeId, username);

      if (response && 'error' in response) {
        throw new Error(response.error);
      }

      res.json(response);
    } catch (err) {
      res.status(500).send(`Error when adding badge to user: ${(err as Error).message}`);
    }
  };

  router.post('/:badgeId/:username', addBadgeToUser);

  return router;
};

export default badgeController;
