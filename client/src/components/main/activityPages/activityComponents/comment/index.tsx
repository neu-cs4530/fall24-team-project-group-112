import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Comment } from '../../../../../types';
import './index.css';

interface CommentItemProps {
  comment: Comment;
  itemType: 'notification' | 'feed';
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, itemType }) => (
  <div className='notification'>
    <div>
      <div className='notification-header'>
        <div>
          <span className='user-in-notification'>{comment.commentBy}</span>
          {` commented on ${itemType === 'notification' ? 'your' : 'a'} post.`}
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

export default CommentItem;
