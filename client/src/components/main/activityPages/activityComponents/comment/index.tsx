import React from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Answer, Comment, Question } from '../../../../../types';
import './index.css';
import ItemHeader from '../itemHeader';
import useNotifications from '../../../../../hooks/useNotifications';

/**
 * CommentItem component displays a comment on a post.
 *
 * @param {string} notificationId - The id of the notification. If present, the delete button will be displayed
 * @param {Comment} comment - The comment object.
 * @param {Question} question - The question object associated with the comment.
 * @param {Question} answer - The answer object associated with the comment.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
interface CommentItemProps {
  notificationId?: string;
  comment: Comment;
  question: Question;
  answer?: Answer;
  itemType: 'notification' | 'feed';
}

/**
 * CommentItem component displays a comment on a post.
 *
 * @param {Comment} comment - The comment object.
 * @param {Question} question - The question object associated with the comment.
 * @param {Question} answer - The answer object associated with the comment.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
const CommentItem: React.FC<CommentItemProps> = ({
  notificationId,
  comment,
  question,
  answer,
  itemType,
}) => {
  const { deleteNotification } = useNotifications();

  return (
    <div className='flex flex-col border border-gray-600 p-4 rounded-md w-full md:w-[500px]'>
      <div className='notification-header'>
        <ItemHeader
          username={comment.commentBy}
          headerText={` commented on ${itemType === 'notification' ? 'your' : 'a'} post.`}
        />
        {notificationId && (
          <button onClick={() => deleteNotification(notificationId)} className='trash-icon'>
            <RiDeleteBin5Line />
          </button>
        )}
      </div>
      <hr className='mt-3' />
      {question && (
        <div className='answer'>
          {question && <ItemHeader username={question.askedBy} headerText='asked:' />}
          <div className='clamp-text'>{question.title}</div>
          <hr className='mt-3' />
        </div>
      )}
      {answer && (
        <div className='answer'>
          <ItemHeader username={answer?.ansBy} headerText='answered:' />
          <div className='clamp-text'>{answer?.text}</div>
          <hr className='mt-3' />
        </div>
      )}
      <div className='answer'>
        <ItemHeader username={comment.commentBy} headerText='commented:' />
        <div className='clamp-text'>{comment.text}</div>
      </div>
      <Link key={question?._id} to={`/question/${question?._id}`}>
        <button className='see-full-text'>See full text</button>
      </Link>
    </div>
  );
};
export default CommentItem;
