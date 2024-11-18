import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Comment } from '../../../../../types';
import './index.css';
import Avatar from '../../../baseComponents/avatar';
import useUserAvatar from '../../../../../hooks/useUserAvatar';

interface CommentItemProps {
  comment: Comment;
  itemType: 'notification' | 'feed';
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, itemType }) => {
  const userAvatar = useUserAvatar(comment.commentBy);
  return (
    <div className='notification'>
      <div>
        <div className='notification-header'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar avatarName={userAvatar} width={30} height={30} circular={true} />
            <span className='user-in-notification'>&nbsp;{comment.commentBy}&nbsp;</span>
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
};

export default CommentItem;
