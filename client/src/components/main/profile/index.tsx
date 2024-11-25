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
 * @param loggedInUser The user object containing the logged-in user's information, or null if a user is not logged in.
 */
const Profile = ({ loggedInUser }: { loggedInUser: User | null }) => {
  const { user, error, badgeOpen, setBadgeOpen } = useProfile(loggedInUser);
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
        <div className='flex justify-center'>
          <div className='profile-container'>
            <ProfileText user={user} loggedInUser={loggedInUser} />
            <div>
              {user.badges.length > 0 && (
                <div className='mt-6'>
                  <div className='flex'>
                    <h2 className='font-bold text-xl ml-5 pt-1'>Badges</h2>
                    <p
                      className='ml-5 bg-stackpurple text-white text-sm hover:bg-stackpurplehover rounded-md p-2 cursor-pointer'
                      onClick={() => setBadgeOpen(true)}>
                      View all badges
                    </p>
                  </div>
                  <BadgeDisplay user={user} open={badgeOpen} onClose={() => setBadgeOpen(false)} />
                </div>
              )}
            </div>

            <QuestionList
              questions={questionsAsked}
              title={`Questions asked by @${user.username}`}
            />
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
          </div>
        </div>
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
