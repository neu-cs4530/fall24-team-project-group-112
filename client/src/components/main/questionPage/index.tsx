import { CircularProgress } from '@mui/material';
import QuestionHeader from './header';
import useQuestionPage from '../../../hooks/useQuestionPage';
import QuestionDisplay from '../profile/questions/question';
import SideBarNav from '../sideBarNav';
import './index.css';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder, isLoading } = useQuestionPage();

  const styles = {
    loadingContainer: 'flex justify-center items-center h-screen',
    mainContainer: 'flex flex-col md:flex-row',
    sideBarContainer: 'md:w-2/12',
    questionContainer: 'md:w-10/12',
    questionList: 'question_list',
    noQuestions: 'bold_title right_padding',
  };

  return isLoading ? (
    <div className={styles.loadingContainer}>
      <CircularProgress />
    </div>
  ) : (
    <div className={styles.mainContainer}>
      <div className={styles.sideBarContainer}>
        <SideBarNav />
      </div>
      <div className={styles.questionContainer}>
        <QuestionHeader
          titleText={titleText}
          qcnt={qlist.length}
          setQuestionOrder={setQuestionOrder}
        />
        <div className={styles.questionList}>
          {qlist.map((q, idx) => (
            <QuestionDisplay question={q} key={idx} />
          ))}
        </div>
        {titleText === 'Search Results' && !qlist.length && (
          <div className={styles.noQuestions}>No Questions Found</div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
