import { FaGithub, FaSchool, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { User } from '../../../../types';
import Avatar from '../../baseComponents/avatar';
import FollowDisplay from '../followDisplay';
import useProfile from '../../../../hooks/useProfile';
import './index.css';

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
  const { followers, following, followersOpen, followingOpen, setFollowersOpen, setFollowingOpen } =
    useProfile();

  const styles = {
    container: 'flex-col',
    header: 'bg-white p-5 shadow-md flex flex-row border border-gray-500',
    avatarContainer: 'flex flex-col ml-4',
    nameUsernameContainer: 'flex flex-row items-end',
    name: 'text-4xl font-bold text-gray-800',
    username: 'text-2xl text-gray-600 ml-12',
    editButton: 'bg-white text-black border border-black text-lg ml-4',
    headline: 'mt-3 text-xl text-gray-500',
    infoContainer: 'flex gap-4',
    infoItem: 'flex gap-2 items-center',
    icon: 'text-sm mb-1',
    github: 'no-underline hover:underline',
    followersContainer: 'flex gap-5 mt-2 cursor-pointer',
    followerCount: 'text-2xl font-bold text-gray-800',
    bioContainer: 'bg-white p-5 shadow-md flex flex-col border border-gray-500',
    bioHeader: 'ml-3 text-2xl font-bold text-gray-500',
    bioContent: 'ml-3 text-xl text-gray-500',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Avatar avatarName={user.avatarName || 'avatar1'} />
        <div className={styles.avatarContainer}>
          <div className={styles.nameUsernameContainer}>
            <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
            <div className={styles.username}>{`@${user.username}`}</div>
            {loggedInUser && loggedInUser.username === user.username && (
              <div>
                <button className={styles.editButton}>
                  <FaEdit className={styles.icon} />
                </button>
              </div>
            )}
            {loggedInUser && loggedInUser.username !== user.username && (
              <div className='follow-button'>
                <button>Follow</button>
              </div>
            )}
          </div>

          <div className={styles.headline}>{user.headline && <div>{user.headline}</div>}</div>
          <div className={styles.infoContainer}>
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
      {user.bio && (
        <div className={styles.bioContainer}>
          <div className={styles.bioHeader}>Bio</div>
          <div className={styles.bioContent}>{user.bio}</div>
        </div>
      )}
    </div>
  );
};

export default ProfileText;
