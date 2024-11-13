import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Comment } from '../../../../types';
import './index.css';

interface CommentNotificationProps {
  comment: Comment;
}

const CommentNotification: React.FC<CommentNotificationProps> = ({ comment }) => (
  <div className='notification'>
    <div>
      <div className='notification-header'>
        <div>
          <span className='user-in-notification'>{comment.commentBy}</span> commented on your post.
        </div>
        <RiDeleteBin5Line className='trash-icon' />
      </div>
      <hr />
      <div className='answer'>
        <div className='user-in-answer'>{comment.commentBy}</div>
        <div>{comment.text}</div>
      </div>
    </div>
  </div>
);

export default CommentNotification;
