import './index.css';

/**
 * Interface representing the props for the Bio component.
 *
 * - bio The bio of the user.
 */
interface ProfileBioProps {
  bio: string;
}

/**
 * Profile bio component that displays the user's bio.
 *
 * @param bio The bio of the user.
 *
 * @returns A React component that displays the user's bio.
 */
const ProfileBio = ({ bio }: ProfileBioProps) => (
  <div className='profile-bio'>
    <div className='bio-header'>Bio</div>
    <div className='bio-content'>{bio}</div>
  </div>
);

export default ProfileBio;
