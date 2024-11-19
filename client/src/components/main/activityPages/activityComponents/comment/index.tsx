import React from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Comment, Question } from '../../../../../types';
import './index.css';
import ItemHeader from '../itemHeader';
import useNotifications from '../../../../../hooks/useNotifications';

/**
 * CommentItem component displays a comment on a post.
 *
 * @param {string} notificationId - The id of the notification. If present, the delete button will be displayed
 * @param {Comment} comment - The comment object.
 * @param {Question} question - The question object associated with the answer.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
interface CommentItemProps {
  notificationId?: string;
  comment: Comment;
  question: Question;
  itemType: 'notification' | 'feed';
}

/**
 * CommentItem component displays a comment on a post.
 *
 * @param {Comment} comment - The comment object.
 * @param {Question} question - The question object associated with the answer.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
const CommentItem: React.FC<CommentItemProps> = ({
  notificationId,
  comment,
  question,
  itemType,
}) => {
  const { deleteNotification } = useNotifications();

  return (
    <div className='notification'>
      <div className='notification-header'>
        <ItemHeader
          username={comment.commentBy}
          headerText={` commented on ${itemType === 'notification' ? 'your' : 'a'} post.`}
        />
        {notificationId && (
          <button onClick={() => deleteNotification(notificationId)}>
            <RiDeleteBin5Line className='trash-icon' />
          </button>
        )}
      </div>
      <hr />
      <div className='answer'>
        {question && <ItemHeader username={question?.askedBy} />}
        <div className='clamp-text'>{question?.text}</div>
      </div>
      <hr />
      <div className='answer'>
        <ItemHeader username={comment.commentBy} />
        <div className='clamp-text'>{comment.text}</div>
      </div>
      <Link key={question?._id} to={`/question/${question?._id}`}>
        <button className='see-full-text'>See full text</button>
      </Link>
    </div>
  );
};
export default CommentItem;
