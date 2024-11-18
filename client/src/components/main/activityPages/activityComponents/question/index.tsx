import React from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Question } from '../../../../../types';
import './index.css';
import useUserAvatar from '../../../../../hooks/useUserAvatar';
import Avatar from '../../../baseComponents/avatar';

interface QuestionItemProps {
  question: Question;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  const userAvatar = useUserAvatar(question.askedBy);
  return (
    <div className='notification'>
      <div>
        <div className='notification-header'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar avatarName={userAvatar} width={30} height={30} circular={true} />
            <span className='user-in-notification'>&nbsp;{question.askedBy}&nbsp;</span> asked a
            question.
          </div>
          <RiDeleteBin5Line className='trash-icon' />
        </div>
        <hr />
        <Link to={`/question/${question._id}`}>
          <div className='answer'>
            <div className='user-in-answer'>{question.askedBy}</div>
            {question.text}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuestionItem;
