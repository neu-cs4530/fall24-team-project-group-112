import React from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Answer, Comment, Question } from '../../../../../types';
import './index.css';
import ItemHeader from '../itemHeader';

/**
 * CommentItem component displays a comment on a post.
 *
 * @param {Comment} comment - The comment object.
 * @param {Question} question - The question object associated with the comment.
 * @param {Question} answer - The answer object associated with the comment.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
interface CommentItemProps {
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
const CommentItem: React.FC<CommentItemProps> = ({ comment, question, answer, itemType }) => (
  <div className='notification'>
    <div className='notification-header'>
      <ItemHeader
        username={comment.commentBy}
        headerText={` commented on ${itemType === 'notification' ? 'your' : 'a'} post.`}
      />
      <RiDeleteBin5Line className='trash-icon' />
    </div>
    <hr />
    {question && (
      <div className='answer'>
        {question && <ItemHeader username={question.askedBy} headerText='asked:' />}
        <div className='clamp-text'>{question.title}</div>
        <hr />
      </div>
    )}
    {answer && (
      <div className='answer'>
        <ItemHeader username={answer?.ansBy} headerText='answered:' />
        <div className='clamp-text'>{answer?.text}</div>
        <hr />
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
export default CommentItem;
