import React from 'react';
/**
 * Interface representing the props for the ProfileHeaderProps component.
 *
 * isEditing - A boolean representing whether the user is currently editing their profile.
 * firstName - A string representing the user's first name.
 * lastName - A string representing the user's last name.
 * username - A string representing the user's username.
 */
interface ProfileHeaderProps {
  isEditing: boolean;
  firstName: string;
  lastName: string;
  username: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Profile header component that displays the user's firstname, lastname, and username.
 *
 * @param isEditing - A boolean representing whether the user is currently editing their profile.
 * @param firstName - A string representing the user's first name.
 * @param lastName - A string representing the user's last name.
 * @param username - A string representing the user's username
 * @param handleChange - A function that handles changes to the user's profile information.
 *
 * @returns A React component that displays the user's header information.
 */
const ProfileHeader = ({
  isEditing,
  firstName,
  lastName,
  username,
  handleChange,
}: ProfileHeaderProps) => {
  const styles = {
    name: 'text-4xl font-bold text-gray-800',
    username: 'text-2xl text-gray-600 ml-12',
  };

  return isEditing ? (
    <>
      <input
        type='text'
        name='firstName'
        value={firstName}
        onChange={handleChange}
        className={`${styles.name} border w-1/4`}
        placeholder='First Name'
      />
      <input
        type='text'
        name='lastName'
        value={lastName}
        onChange={handleChange}
        className={`${styles.name} border w-1/4 ml-4`}
        placeholder='Last Name'
      />
      <div className={styles.username}>{`@${username}`}</div>
    </>
  ) : (
    <>
      <div className={styles.name}>{`${firstName} ${lastName}`}</div>
      <div className={styles.username}>{`@${username}`}</div>
    </>
  );
};

export default ProfileHeader;
