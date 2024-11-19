import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Answer, Question } from '../../../../../types';
import './index.css';
import ItemHeader from '../itemHeader';

/**
 * AnswerItem component displays an answer to a question.
 *
 * @param {Answer} answer - The answer object.
 * @param {Question} question - The question object associated with the answer.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
interface AnswerItemProps {
  answer: Answer;
  question: Question;
  itemType: 'notification' | 'feed';
}

/**
 * AnswerItem component displays an answer to a question.
 *
 * @param {Answer} answer - The answer object.
 * @param {Question} question - The question object associated with the answer.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
const AnswerItem: React.FC<AnswerItemProps> = ({ answer, question, itemType }) => (
  <div className='notification'>
    <div>
      <div className='notification-header'>
        <ItemHeader
          username={answer.ansBy}
          headerText={` answered ${itemType === 'notification' ? 'your' : 'a'} question.`}
        />
        {itemType === 'notification' && <RiDeleteBin5Line className='trash-icon' />}
      </div>
      <hr />
      <div className='answer'>
        {question && <ItemHeader username={question?.askedBy} />}
        <div className='clamp-text'>{question?.text}</div>
      </div>
      <hr />
      <div className='answer'>
        <ItemHeader username={answer.ansBy} />
        <div className='clamp-text'>{answer.text}</div>
      </div>

      <Link key={question?._id} to={`/question/${question?._id}`}>
        <button className='see-full-text'>See full question</button>
      </Link>
    </div>
  </div>
);

export default AnswerItem;
