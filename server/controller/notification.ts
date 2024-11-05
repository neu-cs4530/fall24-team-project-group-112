import express, { Request, Response } from 'express';
import { FakeSOSocket } from '../types';
import { markNotificationsAsSeen } from '../models/application';

const notificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Marks all notifications as seen for a given user
   * If the provided user is invalid, no records are updated and the resulting array is empty
   *
   * @param req The request object containing the username as a parameter.
   * @param res The HTTP response object used to send back the user's notifications.
   */
  const markNotificationsAsSeenRoute = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    try {
      const result = await markNotificationsAsSeen(username);

      if (result && 'error' in result) {
        throw new Error(result.error);
      }

      res.json(result);
    } catch (err: unknown) {
      res.status(500).send(`Error when marking notifications as seen: ${(err as Error).message}`);
    }
  };

  router.patch('/seen/:username', markNotificationsAsSeenRoute);

  return router;
};

export default notificationController;
