import { Link } from 'react-router-dom';
import './index.css';
import { handleHyperlink } from '../../../../tool';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  ansCount: number;
  meta: string;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param ansCount The number of answers to the question.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({ views, text, askby, ansCount, meta }: QuestionBodyProps) => (
  <div className='border-b-[1px] border-dashed border-b-black p-[2%]'>
    <div className='text-xl'>{handleHyperlink(text)}</div>
    <div className='flex mt-4 items-center justify-between'>
      <div className='flex'>
        <div className='font-bold text-lg mr-6'>{views} views</div>
        <div className='font-bold text-lg'>{ansCount} answers</div>
      </div>
      <div className='flex ml-8 gap-2 justify-end'>
        <Link to={`/profile/${askby}`}>
          <div className='font-bold text-stackpurple'>{askby}</div>
        </Link>
        <div className='text-[#7f7f7f]'>asked {meta}</div>
      </div>
    </div>
  </div>
);

export default QuestionBody;
