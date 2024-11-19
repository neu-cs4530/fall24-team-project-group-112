import './index.css';
import QuestionHeader from './header';
import useQuestionPage from '../../../hooks/useQuestionPage';
import QuestionDisplay from '../profile/questions/question';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();

  return (
    <>
      <QuestionHeader
        titleText={titleText}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
      />
      <div id='question_list' className='question_list'>
        {qlist.map((q, idx) => (
          <QuestionDisplay question={q} key={idx} />
        ))}
      </div>
      {titleText === 'Search Results' && !qlist.length && (
        <div className='bold_title right_padding'>No Questions Found</div>
      )}
    </>
  );
};

export default QuestionPage;
