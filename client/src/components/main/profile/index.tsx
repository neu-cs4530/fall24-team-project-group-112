import './index.css';
import ProfileText from './profileText';
import useProfile from '../../../hooks/useProfile';
import { Question } from '../../../types';
import { getQuestionsAskedBy } from '../../../services/questionService';
import QuestionList from './questions/questionList';

const question: Question = {
  _id: '65e9b58910afe6e94fc6e6dc',
  title: 'Question 1 Title',
  text: 'Question 1 Text',
  tags: [
    { name: 'react', description: 'react' },
    { name: 'javascript', description: 'javascript' },
  ],
  answers: [],
  askedBy: 'aarohi',
  askDateTime: new Date('2024-06-03'),
  views: ['question1_user'],
  upVotes: ['question2_user'],
  downVotes: ['question3_user'],
  comments: [],
};
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
          <ProfileHeader user={user} />
          {user.bio ? <ProfileBio bio={user.bio} /> : null}
          <QuestionList questions={questionsAsked} />
        </>
      ) : null}
    </>
  );
};

export default Profile;
