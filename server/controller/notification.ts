import express, { Request, Response } from 'express';
import { FakeSOSocket } from '../types';
import { markNotificationsAsSeen } from '../models/application';

const notificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const markNotificationsAsSeenRoute = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    if (!username) {
      res.status(400).send('Invalid request');
      return;
    }

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
