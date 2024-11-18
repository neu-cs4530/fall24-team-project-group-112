import React from 'react';
import { Notification, Answer, Follow, Comment, Badge } from '../../../../types';
import './index.css';
import AnswerNotification from '../answer';
import CommentNotification from '../comment';
import BadgeNotification from '../badge';
import FollowNotification from '../follow';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  let content;

  switch (notification.notificationType) {
    case 'Answer': {
      const answer = notification.eventId as Answer;
      content = <AnswerNotification answer={answer} />;
      break;
    }
    case 'Comment': {
      const comment = notification.eventId as Comment;
      content = <CommentNotification comment={comment} />;
      break;
    }
    case 'Badge': {
      const badge = notification.eventId as Badge;
      content = <BadgeNotification badge={badge} />;
      break;
    }
    case 'Follow': {
      const follow = notification.eventId as Follow;
      content = <FollowNotification follow={follow} />;
      break;
    }
    default: {
      content = <div>New notification received.</div>;
    }
  }

  return <div className='padding'>{content}</div>;
};

export default NotificationItem;
