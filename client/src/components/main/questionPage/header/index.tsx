import React from 'react';
import './index.css';
import OrderButton from './orderButton';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';
import useHeader from '../../../../hooks/useHeader';

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({ titleText, qcnt, setQuestionOrder }: QuestionHeaderProps) => {
  const { val, handleInputChange, handleKeyDown } = useHeader();

  const styles = {
    container: 'mt-2 px-4 mb-4',
    topRowContainer: 'flex items-center justify-between',
    search:
      'px-4 rounded-lg h-12 w-full mb-4 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500',
    filterButtons: 'flex flex-wrap gap-1',
    questionContainer: 'flex flex-col md:items-center gap-4 md:flex-row justify-between py-2',
  };

  return (
    <div className={styles.container}>
      <div className={styles.topRowContainer}>
        <div className='bold_title'>{titleText}</div>
        <AskQuestionButton />
      </div>
      <div>
        <input
          id='searchBar'
          className={styles.search}
          placeholder='Search for a question...'
          type='text'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.questionContainer}>
        <div>{qcnt} questions</div>
        <div className={styles.filterButtons}>
          {Object.keys(orderTypeDisplayName).map((order, idx) => (
            <OrderButton
              key={idx}
              orderType={order as OrderType}
              setQuestionOrder={setQuestionOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
