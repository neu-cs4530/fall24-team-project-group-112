import React from 'react';
import { FaGithub, FaSchool, FaMapMarkerAlt } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { User } from '../../../../types';

/**
 * Interface representing the props for the ProfileInfoProps component.
 *
 * isEditing - A boolean representing whether the user is currently editing their profile.
 * editingGithubUrl - A string with the user's github url (editing version).
 * editingSchool - A string with the user's school (editing version).
 * editingCity - A string with the user's city (editing version).
 * editingState - A string with the user's state (editing version).
 * editingCompany - A string with the user's company (editing version).
 * user - The User object containing the user's profile information.
 * handleChange - A function that handles changes to the user's profile information.
 */
interface ProfileInfoProps {
  isEditing: boolean;
  editingGithubUrl: string | undefined;
  editingSchool: string | undefined;
  editingCity: string | undefined;
  editingState: string | undefined;
  editingCompany: string | undefined;
  user: User;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Profile info component that displays the user's github, school, city, state, and company information if given.
 *
 * @param isEditing - A boolean representing whether the user is currently editing their profile.
 * @param editingGithubUrl - A string with the user's github url (editing version).
 * @param editingSchool - A string with the user's school (editing version).
 * @param editingCity - A string with the user's city (editing version).
 * @param editingState - A string with the user's state (editing version).
 * @param editingCompany - A string with the user's company (editing version).
 * @param user - The User object containing the user's profile information.
 * @param handleChange - A function that handles changes to the user's profile information.
 *
 * @returns A React component that displays the user's information.
 */
const ProfileInfo = ({
  isEditing,
  user,
  editingGithubUrl,
  editingCity,
  editingState,
  editingSchool,
  editingCompany,
  handleChange,
}: ProfileInfoProps) => {
  const styles = {
    infoContainer: 'flex flex-col md:flex-row md:space-x-4 items-start mt-2 lg:mr-10',
    editingInfoContainer: 'flex flex-col items-start mt-2 justify-between',
    infoItem: 'flex flex-row gap-2 items-center',
    icon: 'text-sm mb-1',
    input: 'border p-1 w-full',
    github: 'no-underline hover:underline',
  };

  return (
    <>
      {isEditing ? (
        <div className={styles.editingInfoContainer}>
          <div className={styles.infoItem}>
            <FaGithub className={styles.icon} />
            <input
              type='url'
              name='githubUrl'
              value={editingGithubUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder='Github URL'
            />
          </div>
          <div className={styles.infoItem}>
            <FaSchool className={styles.icon} />
            <input
              type='text'
              name='school'
              value={editingSchool}
              onChange={handleChange}
              className={styles.input}
              placeholder='School'
            />
          </div>
          <div className={styles.infoItem}>
            <FaMapMarkerAlt className={styles.icon} />
            <div className='flex flex-row'>
              <input
                type='text'
                name='city'
                value={editingCity}
                onChange={handleChange}
                className={styles.input}
                autoComplete='addressLevel2'
                placeholder='City'
              />
              <input
                type='text'
                name='state'
                value={editingState}
                onChange={handleChange}
                className={styles.input}
                autoComplete='addressLevel1'
                placeholder='State'
              />
            </div>
          </div>
          <div className={styles.infoItem}>
            <MdWork className={styles.icon} />
            <input
              type='text'
              name='company'
              value={editingCompany}
              onChange={handleChange}
              className={styles.input}
              placeholder='Company'
            />
          </div>
        </div>
      ) : (
        <div className={styles.infoContainer}>
          {user.githubUrl && (
            <a className={styles.infoItem} href={user.githubUrl} target='_blank' rel='noreferrer'>
              <FaGithub className={styles.icon} />
              GitHub
            </a>
          )}
          {user.school && (
            <div className={styles.infoItem}>
              <FaSchool className={styles.icon} /> {user.school}
            </div>
          )}
          {user.city && user.state && (
            <div className={styles.infoItem}>
              <FaMapMarkerAlt className={styles.icon} />
              <span>{`${user.city}, ${user.state}`}</span>
            </div>
          )}
          {user.company && (
            <div className={styles.infoItem}>
              <MdWork className={styles.icon} />
              <p>{user.company}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileInfo;
