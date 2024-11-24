import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Answer, Question } from '../../../../../types';
import './index.css';
import ItemHeader from '../itemHeader';
import useNotifications from '../../../../../hooks/useNotifications';

/**
 * AnswerItem component displays an answer to a question.
 *
 * @param {string} notificationId - The id of the notification. If present, the delete button will be displayed.
 * @param {Answer} answer - The answer object.
 * @param {Question} question - The question object associated with the answer.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
interface AnswerItemProps {
  notificationId?: string;
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
const AnswerItem: React.FC<AnswerItemProps> = ({ notificationId, answer, question, itemType }) => {
  const { deleteNotification } = useNotifications();

  return (
    <div className='flex flex-col border border-gray-600 p-4 rounded-md w-full md:w-[500px]'>
      <div>
        <div className='notification-header'>
          <ItemHeader
            username={answer.ansBy}
            headerText={` answered ${itemType === 'notification' ? 'your' : 'a'} question.`}
          />
          {notificationId && (
            <button onClick={() => deleteNotification(notificationId)} className='trash-icon'>
              <RiDeleteBin5Line />
            </button>
          )}
        </div>
        <hr className='mt-3' />
        <div className='answer'>
          {question && <ItemHeader username={question?.askedBy} headerText='asked:' />}
          <div className='clamp-text'>{question?.title}</div>
        </div>
        <hr className='mt-3' />
        <div className='answer'>
          <ItemHeader username={answer.ansBy} headerText='answered:' />
          <div className='clamp-text'>{answer.text}</div>
        </div>

        <Link key={question?._id} to={`/question/${question?._id}`}>
          <button className='see-full-text'>See full question</button>
        </Link>
      </div>
    </div>
  );
};

export default AnswerItem;
