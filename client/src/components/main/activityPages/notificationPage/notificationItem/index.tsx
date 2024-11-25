import React from 'react';
import { Notification, Answer, Follow, Comment, Badge, Question } from '../../../../../types';
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
      const question = notification.question as Question;
      content = (
        <AnswerItem
          notificationId={notification._id}
          answer={answer}
          question={question}
          itemType='notification'
        />
      );
      break;
    }
    case 'Comment': {
      const comment = notification.eventId as Comment;
      const question = notification.question as Question;
      const answer = notification.answer as Answer;
      content = (
        <CommentItem
          notificationId={notification._id}
          comment={comment}
          question={question}
          answer={answer}
          itemType='notification'
        />
      );
      break;
    }
    case 'Badge': {
      const badge = notification.eventId as Badge;
      content = (
        <BadgeNotification
          notificationId={notification._id}
          date={notification.notificationDate}
          badge={badge}
        />
      );
      break;
    }
    case 'Follow': {
      const follow = notification.eventId as Follow;
      content = (
        <FollowItem notificationId={notification._id} follow={follow} itemType='notification' />
      );
      break;
    }
    default: {
      content = <div>New notification received.</div>;
    }
  }

  return <div className='padding'>{content}</div>;
};

export default NotificationItem;
