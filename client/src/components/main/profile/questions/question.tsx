import { Link, useNavigate } from 'react-router-dom';
import { Question } from '../../../../types';

export interface QuestionProps {
  question: Question;
}

const QuestionDisplay = ({ question }: QuestionProps) => {
  const navigate = useNavigate();

  return (
    <div className='px-12 py-6 border border-gray-200'>
      <div className='flex justify-between'>
        <p className='font-bold text-xl'>{question.title}</p>
        <div className='flex gap-6'>
          <a className='font-bold text-blue-800' href={`/profile/${question.askedBy}`}>
            {question.askedBy}
          </a>
          <p>{new Date(question.askDateTime).toLocaleDateString()}</p>
        </div>
      </div>
      <div className='flex gap-4 my-2'>
        {question.tags.map(tag => (
          <span key={tag.name} className='text-gray-500 bg-gray-200 rounded-full px-2 py-1'>
            {tag.name}
          </span>
        ))}
      </div>
      <p className='line-clamp-2'>{question.text}</p>
      <div className='flex justify-between mt-2'>
        <Link key={question._id} to={`/question/${question._id}`}>
          <button className='text-blue-700 rounded-md'>See full question</button>
        </Link>
        <div className='flex gap-6'>
          <p>{question.upVotes.length} upvotes</p>
          <p>{question.downVotes.length} downvotes</p>
          <p>{question.comments.length} comments</p>
          <p>{question.views.length} views</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
