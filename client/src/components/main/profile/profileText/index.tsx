import React from 'react';
import { FaGithub, FaSchool, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';
import { Alert } from '@mui/material';
import { MdWork, MdCancel } from 'react-icons/md';
import { User } from '../../../../types';
import Avatar from '../../baseComponents/avatar';
import FollowDisplay from '../followDisplay';
import ErrorDisplay from '../errorDisplay';
import useProfile from '../../../../hooks/useProfile';
import './index.css';
import AvatarDisplay from '../avatarDisplay';

/**
 * Interface representing the props for the ProfileTextProps component.
 *
 * - q: The user object that contains the user's information.
 * - loggedInUser: The logged in user object that contains the logged in user's information, or null if a user is not logged in.
 */
interface ProfileTextProps {
  user: User;
  loggedInUser: User | null;
}

/**
 * Profile text component that displays the user's editable "text" information - their username, first name and last name,
 * and optional information - their github link, school, city, state, company, profile headline, and bio.
 *
 * @param userProfile `User` object that contains the user's information.
 *
 * @returns A React component that displays the user's text information.
 */
const ProfileText = ({ user, loggedInUser }: ProfileTextProps) => {
  const {
    followers,
    following,
    followersOpen,
    setFollowersOpen,
    error,
    setError,
    followingOpen,
    setFollowingOpen,
    avatarOpen,
    setAvatarOpen,
    isEditing,
    setIsEditing,
    formData,
    handleSave,
    handleChange,
    handleSelectAvatar,
    followingOpen,
    showErrorModal,
    setFollowersOpen,
    setFollowingOpen,
    setShowErrorModal,
    postFollow,
    error,
  } = useProfile();

  const isFollowing = followers.some(follow => follow.user.username === loggedInUser?.username);

  const styles = {
    container: 'flex-col ',
    header: 'bg-white p-5 shadow-md flex flex-row',
    avatarContainer: 'flex flex-col ml-4',
    nameUsernameContainer: 'flex flex-row items-end',
    name: 'text-4xl font-bold text-gray-800',
    username: 'text-2xl text-gray-600 ml-12',
    editAvatarContainer: 'flex flex-col ml-4',
    editButton: 'bg-white text-black text-lg ml-8',
    editIcon: 'text-2xl',
    headline: 'mt-1 text-xl text-gray-500',
    infoContainer: 'flex gap-4 mt-3',
    infoItem: 'flex gap-2 items-center',
    icon: 'text-sm mb-1',
    input: 'border',
    github: 'no-underline hover:underline',
    followersContainer: 'flex gap-5 mt-2 cursor-pointer',
    followerCount: 'text-2xl font-bold text-gray-800',
    bioContainer: 'bg-white p-5 shadow-md flex flex-col',
    bioHeader: 'ml-3 text-2xl font-bold text-gray-500',
    bioContent: 'ml-3 text-xl text-gray-500',
    followButton: 'bg-blue-800 text-white rounded-md p-2 ml-4',
    followingButton: 'bg-gray-500 text-white rounded-md p-2 ml-4',
    errorModal: 'fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50',
    modalContent: 'bg-white p-6 rounded-md shadow-lg text-center',
  };

  return (
    <div className={styles.container}>
      {error && (
        <Alert
          severity='error'
          onClose={() => {
            setError('');
          }}>
          {error}
        </Alert>
      )}
      <div className={styles.header}>
        {isEditing ? (
          <div className={styles.editAvatarContainer}>
            <Avatar avatarName={formData.avatarName} />
            <div>
              <button className={styles.editButton} onClick={() => setAvatarOpen(true)}>
                <FaEdit className={styles.editIcon} />
              </button>

              <AvatarDisplay
                open={avatarOpen}
                onClose={() => setAvatarOpen(false)}
                onSelectAvatar={handleSelectAvatar}
              />
            </div>
          </div>
        ) : (
          <Avatar avatarName={user.avatarName || 'avatar1'} />
        )}
        <div className={styles.avatarContainer}>
          <div className={styles.nameUsernameContainer}>
            {isEditing ? (
              <>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`${styles.name} border w-1/4`}
                  placeholder='First Name'
                />
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`${styles.name} border w-1/4 ml-4`}
                  placeholder='Last Name'
                />
                <div className={styles.username}>{`@${user.username}`}</div>
              </>
            ) : (
              <>
                <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
                <div className={styles.username}>{`@${user.username}`}</div>
              </>
            )}
            {!isEditing && loggedInUser && loggedInUser.username === user.username && (
              <div>
                <button className={styles.editButton} onClick={() => setIsEditing(!isEditing)}>
                  <FaEdit className={styles.editIcon} />
                </button>
              </div>
            )}

            {isEditing && loggedInUser && loggedInUser.username === user.username && (
              <>
                <div>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setError('');
                      setIsEditing(!isEditing);
                    }}>
                    <MdCancel className={styles.editIcon} />
                  </button>
                </div>
                <div>
                  <button className={styles.editButton} onClick={() => handleSave()}>
                    <FaSave className={styles.editIcon} />
                  </button>
                </div>
              </>
)}
            {loggedInUser && loggedInUser?.username !== user.username && (
              <div>
                <button
                  onClick={async () => {
                    try {
                      if (loggedInUser) {
                        await postFollow(loggedInUser.username, user.username);
                      }
                    } catch (err) {
                      setShowErrorModal(true);
                    }
                  }}
                  className={isFollowing ? styles.followingButton : styles.followButton}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            )}
          </div>

          <div className={styles.headline}>
            {isEditing ? (
              <input
                type='text'
                name='headline'
                value={formData.headline}
                onChange={handleChange}
                className={`${styles.headline} border`}
                placeholder='Headline'
              />
            ) : (
              user.headline && <div>{user.headline}</div>
            )}
          </div>
          <div className={styles.infoContainer}>
            {isEditing ? (
              <>
                <div className={styles.infoItem}>
                  <FaGithub className={styles.icon} />
                  <input
                    type='url'
                    name='githubUrl'
                    value={formData.githubUrl}
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
                    value={formData.school}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder='School'
                  />
                </div>
                <div className={styles.infoItem}>
                  <FaMapMarkerAlt className={styles.icon} />
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    className={styles.input}
                    autoComplete='addressLevel2'
                    placeholder='City'
                  />
                  <input
                    type='text'
                    name='state'
                    value={formData.state}
                    onChange={handleChange}
                    className={styles.input}
                    autoComplete='addressLevel1'
                    placeholder='State'
                  />
                </div>
                <div className={styles.infoItem}>
                  <MdWork className={styles.icon} />
                  <input
                    type='text'
                    name='company'
                    value={formData.company}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder='Company'
                  />
                </div>
              </>
            ) : (
              <>
                {user.githubUrl && (
                  <div className={styles.github}>
                    <a
                      className={styles.infoItem}
                      href={user.githubUrl}
                      target='_blank'
                      rel='noreferrer'>
                      <FaGithub className={styles.icon} />
                      GitHub
                    </a>
                  </div>
                )}
                {user.school && (
                  <div className={styles.infoItem}>
                    <FaSchool className={styles.icon} /> {user.school}
                  </div>
                )}
                {user.city && user.state && (
                  <div className={styles.infoItem}>
                    <FaMapMarkerAlt className={styles.icon} /> {`${user.city}, ${user.state}`}
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
          <div className={styles.followersContainer}>
            <div>
              <p onClick={() => setFollowersOpen(true)}>
                <span className={styles.followerCount}>{followers.length}</span> followers
              </p>
              <FollowDisplay
                follows={followers}
                open={followersOpen}
                onClose={() => setFollowersOpen(false)}
                type={'Followers'}
              />
            </div>
            <div>
              <p onClick={() => setFollowingOpen(true)}>
                <span className={styles.followerCount}>{following.length}</span> following
              </p>
              <FollowDisplay
                follows={following}
                open={followingOpen}
                onClose={() => setFollowingOpen(false)}
                type={'Following'}
              />
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      {isEditing ? (
        <>
          <div className={styles.bioHeader}>Bio</div>
          <textarea
            name='bio'
            value={formData.bio}
            onChange={handleChange}
            className={`${styles.bioContainer} border w-full`}
            rows={10}
            placeholder='Write a bio here!'
          />
        </>
      ) : (
        user.bio && (
          <div className={styles.bioContainer}>
            <div className={styles.bioHeader}>Bio</div>
            <div className={styles.bioContent}>{user.bio}</div>
          </div>
        )
      )}
      {showErrorModal && (
        <ErrorDisplay
          error={error}
          open={showErrorModal}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileText;
