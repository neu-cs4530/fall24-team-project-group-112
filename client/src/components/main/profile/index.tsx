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
          <ProfileHeader
            firstName={user.firstName}
            lastName={user.lastName}
            username={user.username}
            avatarName={user.avatarName || 'avatar1'}
            github={user.githubUrl}
            school={user.school}
            city={user.city}
            state={user.state}
            company={user.company}
            headline={user.headline}
          />
          {user.bio ? <ProfileBio bio={user.bio} /> : null}
        </>
      ) : null}
    </>
  );
};

export default Profile;
