import { useEffect, useState } from 'react';
import useProfile from '../../../hooks/useProfile';
import ProfileText from './profileText';
import { getQuestionsAnsweredBy, getQuestionsAskedBy } from '../../../services/questionService';
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
  const [questionsAnswered, setQuestionsAnswered] = useState<Question[]>([]);

  useEffect(() => {
    const fetchData = async (username: string) => {
      try {
        const askedByRes = await getQuestionsAskedBy(username);
        setQuestionsAsked(askedByRes || []);

        const answeredByRes = await getQuestionsAnsweredBy(username);
        setQuestionsAnswered(answeredByRes || []);
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
          <QuestionList questions={questionsAsked} title={`Questions asked by @${user.username}`} />
          <QuestionList
            questions={questionsAnswered}
            title={`Questions answered by @${user.username}`}
          />
        </>
      ) : null}
    </>
  );
};

export default Profile;
