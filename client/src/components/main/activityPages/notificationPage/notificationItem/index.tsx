import React from 'react';
import { Notification, Answer, Follow, Comment, Badge, Question } from '../../../../types';
import './index.css';
import AnswerItem from '../../activityComponents/answer';
import CommentItem from '../../activityComponents/comment';
import BadgeNotification from '../../activityComponents/badge';
import FollowItem from '../../activityComponents/follow';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  let content;

  switch (notification.notificationType) {
    case 'Answer': {
      const answer = notification.eventId as Answer;
      const question = notification.questionId as Question;
      content = <AnswerNotification answer={answer} question={question} />;
      break;
    }
    case 'Comment': {
      const comment = notification.eventId as Comment;
      content = <CommentItem comment={comment} itemType='notification' />;
      break;
    }
    case 'Badge': {
      const badge = notification.eventId as Badge;
      content = <BadgeNotification badge={badge} />;
      break;
    }
    case 'Follow': {
      const follow = notification.eventId as Follow;
      content = <FollowItem follow={follow} itemType='notification' />;
      break;
    }
    default: {
      content = <div>New notification received.</div>;
    }
  }

  return <div className='padding'>{content}</div>;
};

export default NotificationItem;
