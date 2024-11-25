import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Follow } from '../../../../../types';
import './index.css';
import ItemHeader from '../itemHeader';
import useNotifications from '../../../../../hooks/useNotifications';
import { getMetaData } from '../../../../../tool';

/**
 * FollowItem component displays a follow notification.
 *
 * @param {string} notificationId - The id of the notification. If present, the delete button will be displayed.
 * @param {Follow} follow - The follow object.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
interface FollowItemProps {
  notificationId?: string;
  follow: Follow;
  itemType: 'notification' | 'feed';
}

/**
 * FollowItem component displays a follow notification.
 *
 * @param {string} notificationId - The id of the notification. If present, the delete button will be displayed.
 * @param {Follow} follow - The follow object.
 * @param {'notification' | 'feed'} itemType - The type of the item.
 */
const FollowItem: React.FC<FollowItemProps> = ({ notificationId, follow, itemType }) => {
  const { deleteNotification } = useNotifications();
  return (
    <div className='flex flex-col border border-gray-600 p-4 rounded-md lg:w-[600px]'>
      <div className='notification-header'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {itemType === 'notification' ? (
            <ItemHeader username={follow.followerUsername} headerText={` followed you.`} />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <ItemHeader username={follow.followerUsername} headerText={`followed`} />
              &nbsp; &nbsp;
              <span className='mt-1'>
                <ItemHeader username={follow.followeeUsername} />
              </span>
            </div>
          )}
        </div>
        {notificationId && (
          <button onClick={() => deleteNotification(notificationId)} className='trash-icon'>
            <RiDeleteBin5Line />
          </button>
        )}
      </div>
      <p className='text-gray-500'>{getMetaData(new Date(follow.followDateTime))}</p>
    </div>
  );
};

export default FollowItem;
