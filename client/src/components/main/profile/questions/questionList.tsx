import { Link } from 'react-router-dom';
import { Question } from '../../../../types';
import QuestionDisplay from './question';
import { useState } from 'react';

export interface QuestionListProps {
  questions: Question[];
}

const QuestionList = ({ questions }: QuestionListProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='px-12 py-6 border border-gray-200'>
      {questions.map(q => (
        <QuestionDisplay key={q._id} question={q} />
      ))}
    </div>
  );
};

export default QuestionList;
