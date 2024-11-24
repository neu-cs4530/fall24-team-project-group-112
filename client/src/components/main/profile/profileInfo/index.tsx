import React from 'react';
import { FaGithub, FaSchool, FaMapMarkerAlt } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { User } from '../../../../types';

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
    infoContainer: 'flex flex-col md:flex-row md:space-x-4 items-start mt-2 justify-between mr-40',
    infoItem: 'flex flex-row gap-2 items-center',
    icon: 'text-sm mb-1',
    input: 'border p-1 w-full',
    github: 'no-underline hover:underline',
  };

  return (
    <div className={styles.infoContainer}>
      {isEditing ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
