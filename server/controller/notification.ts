import express, { Request, Response } from 'express';
import { FakeSOSocket } from '../types';
import { markNotificationsAsSeen, getNotificationsForUser } from '../models/application';

const notificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Marks all notifications as seen for a given user
   * If the provided user is invalid, an error will be returned and no notifications are updated.
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

  /**
   * Gets all notifications for a given user
   * If the provided user is invalid, an error will be returned.
   *
   * @param req The request object containing the username as a parameter.
   * @param res The HTTP response object used to send back the user's notifications.
   */
  const getNotifications = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    try {
      const result = await getNotificationsForUser(username);

      if (result && 'error' in result) {
        throw new Error(result.error);
      }

      res.json(result);
    } catch (err: unknown) {
      res.status(500).send(`Error when getting notifications: ${(err as Error).message}`);
    }
  };

  router.patch('/seen/:username', markNotificationsAsSeenRoute);
  router.get('/get/:username', getNotifications);

  return router;
};

export default notificationController;
