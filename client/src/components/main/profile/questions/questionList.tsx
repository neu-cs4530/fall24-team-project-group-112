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

  const styles = {
    container: 'px-4 border border-gray-200 pb-2',
    header:
      'cursor-pointer flex tablet:flex-row tablet:flex-wrap mobile:flex-col tablet:items-center items-start justify-between py-6',
    title: 'text-xl font-bold',
    iconContainer: 'mt-1 tablet:mt-0',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={toggleOpen}>
        <p className={styles.title}>{title}</p>
        <div className={styles.iconContainer}>{open ? <MdExpandLess /> : <MdExpandMore />}</div>
      </div>
      {open && (
        <>
          {questions.length > 0 ? (
            questions.map(q => <QuestionDisplay key={q._id} question={q} />)
          ) : (
            <p>No questions to display</p>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionList;
