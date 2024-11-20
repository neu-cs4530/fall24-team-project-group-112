import React from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Question } from '../../../../../types';
import './index.css';
import ItemHeader from '../itemHeader';

interface QuestionItemProps {
  question: Question;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => (
  <div className='notification'>
    <div className='notification-header'>
      <ItemHeader username={question.askedBy} headerText={`asked a question.`} />
      <RiDeleteBin5Line className='trash-icon' />
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
