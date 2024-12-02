import { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import QuestionDisplay from './question';
import { Question } from '../../../../types';

/**
 * QuestionListProps is an interface for the QuestionList component props.
 *
 * @param {Question[]} questions - The list of questions.
 * @param {string} title - The title of the question list.
 */
export interface QuestionListProps {
  questions: Question[];
  title: string;
}

/**
 * QuestionList component displays a list of questions.
 *
 * @param {Question[]} questions - The list of questions.
 * @param {string} title - The title of the question list.
 */
const QuestionList = ({ questions, title }: QuestionListProps) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const styles = {
    container: 'px-4 border border-gray-200 pb-2',
    header:
      'cursor-pointer flex md:flex-row md:flex-wrap mobile:flex-col md:items-center items-start justify-between py-6',
    title: 'text-xl font-bold',
    iconContainer: 'mt-1 md:mt-0',
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
