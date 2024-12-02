import express, { Request, Response } from 'express';
import { DeleteNotificationRequest, FakeSOSocket, GetNotificationRequest } from '../types';
import {
  markNotificationsAsSeen,
  deleteNotificationsForUser,
  getNotificationsForUser,
} from '../models/application';

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
   * Deletes all notifications for the given user if no notification id is provided, otherwise deletes a singular notification.
   * If the provided user is invalid, or the notification id is invalid, an error will be returned and no notifications are deleted.
   *
   * @param req The request object containing the username as a parameter, and an optional notification id to delete a singular notification.
   * @param res The HTTP response object used to send back an empty result or an error
   */
  const deleteNotifications = async (
    req: DeleteNotificationRequest,
    res: Response,
  ): Promise<void> => {
    const { username, notificationId } = req.params;

    let result;

    try {
      if (notificationId) {
        result = await deleteNotificationsForUser(username, notificationId); // Pass notificationId if provided
        socket.emit('notificationDelete', notificationId);
      } else {
        result = await deleteNotificationsForUser(username);
      }

      if (result && 'error' in result) {
        throw new Error(result.error);
      }

      res.json(result);
    } catch (err: unknown) {
      res.status(500).send(`Error when deleting notifications: ${(err as Error).message}`);
    }
  };

  /**
   * Gets all notifications for a given user
   * If the provided user is invalid, an error will be returned.
   *
   * @param req The request object containing the username as a parameter.
   * @param res The HTTP response object used to send back the user's notifications.
   */
  const getNotifications = async (req: GetNotificationRequest, res: Response): Promise<void> => {
    const { username } = req.params;
    const { type } = req.query;
    try {
      const result = await getNotificationsForUser(username, type);

      if (result && 'error' in result) {
        throw new Error(result.error);
      }

      res.json(result);
    } catch (err: unknown) {
      res.status(500).send(`Error when getting notifications: ${(err as Error).message}`);
    }
  };

  router.patch('/seen/:username', markNotificationsAsSeenRoute);
  router.get('/:username', getNotifications);
  router.delete('/:username/:notificationId?', deleteNotifications);
  return router;
};

export default notificationController;
