import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Answer } from '../../../../../types';
import './index.css';

interface AnswerItemProps {
  answer: Answer;
  itemType: 'notification' | 'feed';
}

const AnswerItem: React.FC<AnswerItemProps> = ({ answer, itemType }) => (
  <div className='notification'>
    <div>
      <div className='notification-header'>
        <div>
          <span className='user-in-notification'>{answer.ansBy}</span>
          {` answered ${itemType === 'notification' ? 'your' : 'a'} question.`}
        </div>
        <RiDeleteBin5Line className='trash-icon' />
      </div>
      <hr />
      <div className='answer'>
        <div className='user-in-answer'>{answer.ansBy}</div>
        {answer.text}
      </div>
    </div>
  </div>
);

export default AnswerItem;
