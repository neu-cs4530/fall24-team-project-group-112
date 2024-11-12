import { useEffect, useState } from 'react';
import useProfile from '../../../hooks/useProfile';
import ProfileText from './profileText';
import { getQuestionsAskedBy } from '../../../services/questionService';
import { User, Question } from '../../../types';
import QuestionList from './questions/questionList';
import './index.css';

/**
 * Profile Component displays the full content on a user's profile page. It also includes functionality for a user to edit the information on their own profile page.
 *
 * @param user The user object containing the logged in user's information, or null if a user is not logged in.
 */
const Profile = (loggedInUser: { loggedInUser: User | null }) => {
  const { user, error } = useProfile();
  const [questionsAsked, setQuestionsAsked] = useState<Question[]>([]);

  useEffect(() => {
    const fetchData = async (username: string) => {
      try {
        const res = await getQuestionsAskedBy(username);
        setQuestionsAsked(res || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    };

    if (user) {
      fetchData(user.username);
    }
  }, [user]);

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
          {questionsAsked.length > 1 && (
            <QuestionList
              questions={questionsAsked}
              title={`Questions asked by @${user.username}`}
            />
          )}
        </>
      ) : null}
    </>
  );
};

export default Profile;
