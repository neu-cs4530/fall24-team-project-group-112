import React from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { Alert, Tooltip } from '@mui/material';
import { MdCancel } from 'react-icons/md';
import { User } from '../../../../types';
import Avatar from '../../baseComponents/avatar';
import FollowDisplay from '../followDisplay';
import ErrorDisplay from '../errorDisplay';
import useProfile from '../../../../hooks/useProfile';
import './index.css';
import AvatarDisplay from '../avatarDisplay';
import ProfileHeader from '../profileHeader';
import ProfileInfo from '../profileInfo';

/**
 * Interface representing the props for the ProfileTextProps component.
 *
 * - user: The user object that contains the user's information.
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
 * @param user `User` object that contains the user's information.
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
    showErrorModal,
    setShowErrorModal,
    postFollow,
    isFollowing,
  } = useProfile(loggedInUser);

  const styles = {
    container: 'flex-col ',
    header: 'bg-white p-5 shadow-md flex flex-row',
    avatarContainer: 'flex flex-col ml-4',
    nameUsernameContainer: 'flex flex-row items-end justify-between',
    editAvatarContainer: 'flex flex-col ml-4',
    editButton: 'bg-white text-black text-lg rounded-md p-2',
    editIcon: 'text-2xl mt-1',
    headline: 'mt-1 text-xl text-gray-500',
    input: 'border',
    followersContainer: 'flex gap-5 mt-2 cursor-pointer',
    followerCount: 'text-2xl font-bold text-gray-800',
    bioContainer: 'bg-white p-5 shadow-md flex flex-col h-48',
    bioHeader: 'ml-3 text-2xl font-bold text-gray-500 mb-2',
    bioContent: 'ml-3 text-xl text-gray-500',
    followButton: 'bg-blue-800 text-white rounded-md py-2 px-5 ml-4 mb-1',
    followingButton: 'bg-gray-500 text-white rounded-md p-2 ml-4 mb-1',
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
            <div className='flex flex-row items-end'>
              <ProfileHeader
                isEditing={isEditing}
                firstName={formData.firstName}
                lastName={formData.lastName}
                user={user}
                handleChange={handleChange}
              />

              {!isEditing && loggedInUser && loggedInUser.username === user.username && (
                <div>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setIsEditing(true);
                    }}>
                    <FaEdit className={styles.editIcon} />
                  </button>
                </div>
              )}
            </div>

            {isEditing && loggedInUser && loggedInUser.username === user.username && (
              <>
                <div>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setError('');
                      setIsEditing(false);
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
                {/* Conditionally render Tooltip only for "Follow" button */}
                {!isFollowing ? (
                  <Tooltip title='Click here to follow the user' arrow>
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
                      className={styles.followButton}>
                      Follow
                    </button>
                  </Tooltip>
                ) : (
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
                    className={styles.followingButton}>
                    Following
                  </button>
                )}
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
                className={`${styles.headline} border p-1`}
                placeholder='Headline'
              />
            ) : (
              user.headline && <div>{user.headline}</div>
            )}
          </div>

          <ProfileInfo
            isEditing={isEditing}
            user={user}
            editingGithubUrl={formData.githubUrl}
            editingSchool={formData.school}
            editingCity={formData.city}
            editingState={formData.state}
            editingCompany={formData.company}
            handleChange={handleChange}
          />

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
          <div className={`${styles.bioHeader} mt-5 mb-3 ml-4`}>Bio</div>
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
