import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Answer } from '../../../../../types';
import './index.css';
import useUserAvatar from '../../../../../hooks/useUserAvatar';
import Avatar from '../../../baseComponents/avatar';

interface AnswerItemProps {
  answer: Answer;
  itemType: 'notification' | 'feed';
}

const AnswerItem: React.FC<AnswerItemProps> = ({ answer, itemType }) => {
  const userAvatar = useUserAvatar(answer.ansBy);

  return (
    <div className='notification'>
      <div>
        <div className='notification-header'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar avatarName={userAvatar} width={30} height={30} circular={true} />
            <span className='user-in-notification'>&nbsp;{answer.ansBy}&nbsp;</span>
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
};

export default AnswerItem;
