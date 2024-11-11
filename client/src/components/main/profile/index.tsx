import { useEffect, useState } from 'react';
import './index.css';
import ProfileText from './profileText';
import useProfile from '../../../hooks/useProfile';
import { User } from '../../../types';

import QuestionDisplay from './questions/question';
import { Question } from '../../../types';
import { getQuestionsAskedBy } from '../../../services/questionService';

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
        console.log(username);
        const res = await getQuestionsAskedBy(username);
        console.log(res);
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
