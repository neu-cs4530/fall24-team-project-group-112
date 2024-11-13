import { Link } from 'react-router-dom';
import { Question } from '../../../../types';

export interface QuestionProps {
  question: Question;
}

const QuestionDisplay = ({ question }: QuestionProps) => {
  const styles = {
    container: 'px-12 py-6 border border-gray-200',
    header: 'flex justify-between',
    title: 'font-bold text-xl',
    linkContainer: 'flex gap-6',
    link: 'font-bold text-blue-800',
    tagContainer: 'flex gap-4 my-2',
    tag: 'text-gray-500 bg-gray-200 rounded-full px-2 py-1',
    questionText: 'line-clamp-2',
    bottomContainer: 'flex justify-between mt-2',
    button: 'text-blue-700 rounded-md',
    metricsContainer: 'flex gap-6',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>{question.title}</p>
        <div className={styles.linkContainer}>
          <Link className={styles.link} key={question._id} to={`/profile/${question.askedBy}`}>
            {question.askedBy}
          </Link>
          <p>{new Date(question.askDateTime).toLocaleDateString()}</p>
        </div>
      </div>
      <div className={styles.tagContainer}>
        {question.tags.map(tag => (
          <span key={tag.name} className={styles.tag}>
            {tag.name}
          </span>
        ))}
      </div>
      <p className={styles.questionText}>{question.text}</p>
      <div className={styles.bottomContainer}>
        <Link key={question._id} to={`/question/${question._id}`}>
          <button className={styles.button}>See full question</button>
        </Link>
        <div className={styles.metricsContainer}>
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
