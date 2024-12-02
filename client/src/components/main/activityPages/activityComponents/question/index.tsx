import React from 'react';
import { Link } from 'react-router-dom';
import { Question } from '../../../../../types';
import './index.css';
import ItemHeader from '../itemHeader';

/**
 * QuestionItemProps is an interface for the QuestionItem component props.
 *
 * @param {Question} question - The question object.
 */
interface QuestionItemProps {
  question: Question;
}

/**
 * QuestionItem component displays a question notification.
 *
 * @param {Question} question - The question object.
 */
const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => (
  <div className='notification'>
    <div className='notification-header'>
      <ItemHeader username={question.askedBy} headerText={`asked a question.`} />
    </div>
    <hr />
    <div className='answer'>
      <ItemHeader username={question.askedBy} />
      <div className='clamp-text'>{question.title}</div>
    </div>
    <Link key={question?._id} to={`/question/${question?._id}`}>
      <button className='see-full-text'>See full question</button>
    </Link>
  </div>
);

export default QuestionItem;
