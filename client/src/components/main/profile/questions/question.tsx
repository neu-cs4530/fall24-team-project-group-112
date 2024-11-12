import { useNavigate } from 'react-router-dom';
import { Question } from '../../../../types';

export interface QuestionProps {
  question: Question;
}

const QuestionDisplay = ({ question }: QuestionProps) => {
  const navigate = useNavigate();

  return (
    <div className='px-12 py-6' onClick={() => navigate(`/question/${question._id}`)}>
      <a href={`/question/${question._id}`}>
        <div className='flex justify-between'>
          <p className='font-bold text-xl'>{question.title}</p>
          <div className='flex gap-6'>
            <a className='font-bold text-blue-800' href={`/profile/${question.askedBy}`}>
              {question.askedBy}
            </a>
            <p>{new Date(question.askDateTime).toLocaleDateString()}</p>
          </div>
        </div>
        <p>{question.text}</p>
        <div className='flex gap-6'>
          <p>{question.upVotes.length} upvotes</p>
          <p>{question.downVotes.length} downvotes</p>
          <p>{question.views.length} views</p>
        </div>
      </a>
    </div>
  );
};

export default QuestionDisplay;
