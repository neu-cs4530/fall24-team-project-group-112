import './index.css';
import ProfileText from './profileText';
import useProfile from '../../../hooks/useProfile';
import { User } from '../../../types';

/**
 * Profile Component displays the full content on a user's profile page. It also includes functionality for a user to edit the information on their own profile page.
 *
 * @param user The user object containing the logged in user's information, or null if a user is not logged in.
 */
const Profile = (loggedInUser: { loggedInUser: User | null }) => {
  const { user, error } = useProfile();

  if (error) {
    return (
      <div className='container'>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <>
          <ProfileText user={user} loggedInUser={loggedInUser.loggedInUser} />
        </>
      ) : null}
    </>
  );
};

export default Profile;
