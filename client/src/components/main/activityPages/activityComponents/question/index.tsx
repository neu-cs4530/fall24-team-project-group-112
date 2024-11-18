import React from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Question } from '../../../../../types';
import './index.css';

interface QuestionItemProps {
  question: Question;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => (
  <div className='notification'>
    <div>
      <div className='notification-header'>
        <div>
          <span className='user-in-notification'>{question.askedBy}</span> asked a question.
        </div>
        <RiDeleteBin5Line className='trash-icon' />
      </div>
      <hr />
      <div className='answer'>
        <div className='user-in-answer'>{question.askedBy}</div>
        <Link to={`/question/${question._id}`}>{question.text}</Link>
      </div>
    </div>
  </div>
);

export default QuestionItem;
