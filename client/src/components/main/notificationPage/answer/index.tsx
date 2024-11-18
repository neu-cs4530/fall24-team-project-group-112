import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Answer, Question } from '../../../../types';
import './index.css';

interface AnswerNotificationProps {
  answer: Answer;
  question: Question;
}

const AnswerNotification: React.FC<AnswerNotificationProps> = ({ answer, question }) => (
  <Link to={`/question/${question._id}`}>
    <div className='notification'>
      <div>
        <div className='notification-header'>
          <div>
            <span className='user-in-notification'>{answer.ansBy}</span> answered your question.
          </div>
          <RiDeleteBin5Line className='trash-icon' />
        </div>
        <hr />
        <div className='answer'>
          <div className='user-in-answer'>{question.askedBy}</div>
          <div>{question.title}</div>
        </div>
        <div className='answer'>
          <div className='user-in-answer'>{answer.ansBy}</div>
          <div>{answer.text}</div>
        </div>
      </div>
    </div>
  </Link>
);

export default AnswerNotification;
