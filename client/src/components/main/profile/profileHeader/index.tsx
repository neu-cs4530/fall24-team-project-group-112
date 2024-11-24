import React from 'react';
import { User } from '../../../../types';
/**
 * Interface representing the props for the ProfileHeaderProps component.
 *
 * isEditing - A boolean representing whether the user is currently editing their profile.
 * firstName - A string representing the user's first name.
 * lastName - A string representing the user's last name.
 * user - A User object that contains the user's information.
 */
interface ProfileHeaderProps {
  isEditing: boolean;
  firstName: string;
  lastName: string;
  user: User;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Profile header component that displays the user's firstname, lastname, and username.
 *
 * @param isEditing - A boolean representing whether the user is currently editing their profile.
 * @param firstName - A string representing the user's first name.
 * @param lastName - A string representing the user's last name.
 * @param user - A User object that contains the user's information.
 * @param handleChange - A function that handles changes to the user's profile information.
 *
 * @returns A React component that displays the user's header information.
 */
const ProfileHeader = ({
  isEditing,
  firstName,
  lastName,
  user,
  handleChange,
}: ProfileHeaderProps) => {
  const styles = {
    name: 'text-4xl font-bold text-gray-800 p-1',
    username: 'text-2xl text-gray-600 ml-12 p-1',
  };

  return isEditing ? (
    <div className='flex flex-col sm:flex-row items-center'>
      <div className='flex flex-wrap gap-2'>
        <input
          type='text'
          name='firstName'
          value={firstName}
          onChange={handleChange}
          className={`${styles.name} border w-48`}
          placeholder='First Name'
        />
        <input
          type='text'
          name='lastName'
          value={lastName}
          onChange={handleChange}
          className={`${styles.name} border w-48`}
          placeholder='Last Name'
        />
      </div>
      <div className={styles.username}>{`@${user.username}`}</div>
    </div>
  ) : (
    <>
      <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
      <div className={styles.username}>{`@${user.username}`}</div>
    </>
  );
};

export default ProfileHeader;
