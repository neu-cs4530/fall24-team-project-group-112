import './index.css';

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ title }: AnswerHeaderProps) => (
  <div id='answersHeader' className='px-6'>
    <div className='bold_title'>{title}</div>
  </div>
);

export default AnswerHeader;
