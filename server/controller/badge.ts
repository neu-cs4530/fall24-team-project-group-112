import express, { Response, Router } from 'express';
import { FakeSOSocket, AddBadgeRequest, BadgeName, Badge, BadgeColor } from '../types';
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

    let badge: Badge;
    switch (badgeId) {
      case 'autobiographer':
        badge = {
          name: BadgeName.AUTOBIOGRAPHER,
          description: 'You have completed every section of your profile details!',
          color: BadgeColor.BRONZE,
        };
        break;
      case 'voter':
        badge = {
          name: BadgeName.VOTER,
          description: 'You have cast your first upvote or downvote!',
          color: BadgeColor.BRONZE,
        };
        break;
      case 'speedy_answerer':
        badge = {
          name: BadgeName.SPEEDY_ANSWERER,
          description: 'You have answered a question within 30 minutes of it being asked!',
          color: BadgeColor.SILVER,
        };
        break;
      case 'community_helper':
        badge = {
          name: BadgeName.COMMUNITY_HELPER,
          description: 'You have answered 10 different questions within a week!',
          color: BadgeColor.SILVER,
        };
        break;
      case 'top_answerer':
        badge = {
          name: BadgeName.TOP_ANSWERER,
          description: 'You have answered over 20 questions!',
          color: BadgeColor.GOLD,
        };
        break;
      case 'lifesaver':
        badge = {
          name: BadgeName.LIFESAVER,
          description:
            'You have asked a question that is upvoted more than 50 times within a week of posting!',
          color: BadgeColor.GOLD,
        };
        break;
      default:
        res.status(404).send('Invalid badge');
        return;
    }

    try {
      const response = await addBadge(username, badge);

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
