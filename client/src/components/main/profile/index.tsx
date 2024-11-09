import './index.css';
import ProfileHeader from './profileHeader';
import ProfileBio from './profileBio';
import useProfile from '../../../hooks/useProfile';
/**
 * Profile Component displays the full content on a user's profile page. It also includes functionality for a user to edit the information on their own profile page.
 */
const Profile = () => {
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
          <ProfileHeader user={user} />
          {user.bio ? <ProfileBio bio={user.bio} /> : null}
        </>
      ) : null}
    </>
  );
};

export default Profile;
