import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Answer } from '../../../../types';
import './index.css';

interface AnswerNotificationProps {
  answer: Answer;
}

const AnswerNotification: React.FC<AnswerNotificationProps> = ({ answer }) => (
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
        <div className='user-in-answer'>{answer.ansBy}</div>
        <div>{answer.text}</div>
      </div>
    </div>
  </div>
);

export default AnswerNotification;
