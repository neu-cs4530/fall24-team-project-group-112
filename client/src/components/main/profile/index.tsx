import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import useProfile from '../../../hooks/useProfile';
import ProfileText from './profileText';
import {
  getQuestionsAnsweredBy,
  getQuestionsAskedBy,
  getQuestionsDownvotedBy,
  getQuestionsUpvotedBy,
} from '../../../services/questionService';
import { User, Question } from '../../../types';
import QuestionList from './questions/questionList';
import './index.css';
import BadgeDisplay from './badgeDisplay';

/**
 * Profile Component displays the full content on a user's profile page. It also includes functionality for a user to edit the information on their own profile page.
 *
 * @param user The user object containing the logged in user's information, or null if a user is not logged in.
 */
const Profile = (loggedInUser: { loggedInUser: User | null }) => {
  const { user, error } = useProfile(loggedInUser.loggedInUser);
  const [questionsAsked, setQuestionsAsked] = useState<Question[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState<Question[]>([]);
  const [questionsDownvoted, setQuestionsDownvoted] = useState<Question[]>([]);
  const [questionsUpvoted, setQuestionsUpvoted] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (username: string) => {
      try {
        const askedByRes = await getQuestionsAskedBy(username);
        setQuestionsAsked(askedByRes || []);

        const answeredByRes = await getQuestionsAnsweredBy(username);
        setQuestionsAnswered(answeredByRes || []);

        const downvotedByRes = await getQuestionsDownvotedBy(username);
        setQuestionsDownvoted(downvotedByRes || []);

        const upvotedByRes = await getQuestionsUpvotedBy(username);
        setQuestionsUpvoted(upvotedByRes || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } finally {
        setIsLoading(false);
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
      {user && !isLoading ? (
        <>
          <ProfileText user={user} loggedInUser={loggedInUser.loggedInUser} />
          <div>
            <BadgeDisplay user={user} />
          </div>
          <QuestionList questions={questionsAsked} title={`Questions asked by @${user.username}`} />
          <QuestionList
            questions={questionsAnswered}
            title={`Questions answered by @${user.username}`}
          />
          <QuestionList
            questions={questionsUpvoted}
            title={`Questions upvoted by @${user.username}`}
          />
          <QuestionList
            questions={questionsDownvoted}
            title={`Questions downvoted by @${user.username}`}
          />
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default Profile;
