import { Link } from 'react-router-dom';
import { Question } from '../../../../types';
import { getMetaData } from '../../../../tool';

export interface QuestionProps {
  question: Question;
}

const QuestionDisplay = ({ question }: QuestionProps) => {
  const styles = {
    container: 'px-6 md:px-12 py-6 border border-gray-200 cursor-pointer hover:bg-stackpurplehover',
    header: 'md:flex justify-between',
    title: 'font-bold text-xl',
    linkContainer: 'flex gap-6 cursor-pointer',
    link: 'font-bold text-stackpurple',
    tagContainer: 'flex gap-2 lg:gap-4 flex-wrap',
    tag: 'text-gray-500 bg-gray-200 rounded-full px-2 lg:px-2 py-1',
    questionText: 'line-clamp-2',
    bottomContainer: 'lg:flex justify-between mt-2',
    button: 'text-blue-700 rounded-md',
    metricsContainer: 'flex gap-6',
    metricsPair: 'md:flex gap-6',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link key={question._id} to={`/question/${question._id}`}>
          <p className={styles.title}>{question.title}</p>
        </Link>
        <div className={styles.linkContainer}>
          <Link className={styles.link} key={question._id} to={`/profile/${question.askedBy}`}>
            {question.askedBy}
          </Link>
          <p>{getMetaData(new Date(question.askDateTime))}</p>
        </div>
      </div>
      <Link key={question._id} to={`/question/${question._id}`}>
        <p className={styles.questionText}>{question.text}</p>
        <div className={styles.bottomContainer}>
          <div className={styles.tagContainer}>
            {question.tags.map(tag => (
              <span key={tag.name} className={styles.tag}>
                {tag.name}
              </span>
            ))}
          </div>
          <div className={styles.metricsContainer}>
            <div className={styles.metricsPair}>
              <p>{question.upVotes.length} upvotes</p>
              <p>{question.downVotes.length} downvotes</p>
            </div>
            <div className={styles.metricsPair}>
              <p>{question.comments.length} comments</p>
              <p>{question.views.length} views</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default QuestionDisplay;
