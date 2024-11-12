import { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import QuestionDisplay from './question';
import { Question } from '../../../../types';

export interface QuestionListProps {
  questions: Question[];
  title: string;
}

const QuestionList = ({ questions, title }: QuestionListProps) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(prevOpen => !prevOpen);
  };

  return (
    <div className='px-4 py-6 border border-gray-200'>
      <div
        className='cursor-pointer flex tablet:flex-row tablet:flex-wrap mobile:flex-col tablet:items-center items-start justify-between'
        onClick={toggleOpen}>
        <p className='text-xl font-bold'>{title}</p>
        <div className='mt-1 tablet:mt-0'>{open ? <MdExpandLess /> : <MdExpandMore />}</div>{' '}
      </div>
      {open && questions.map(q => <QuestionDisplay key={q._id} question={q} />)}
    </div>
  );
};

export default QuestionList;
