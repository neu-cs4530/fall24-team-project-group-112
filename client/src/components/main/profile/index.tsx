import { useEffect, useState } from 'react';
import useProfile from '../../../hooks/useProfile';
import QuestionDisplay from './questions/question';
import ProfileText from './profileText';
import { getQuestionsAskedBy } from '../../../services/questionService';
import { User, Question } from '../../../types';
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
  }, [user]); // Add `user` as a dependency

  return error ? (
    <div className='container'>
      <h2>{error}</h2>
    </div>
  ) : (
    <>
      {user ? (
        <>
          <ProfileText user={user} loggedInUser={loggedInUser.loggedInUser} />
          {questionsAsked.map(q => (
            <QuestionDisplay key={q._id} question={q} />
          ))}
        </>
      ) : null}
    </>
  );
};

export default Profile;
