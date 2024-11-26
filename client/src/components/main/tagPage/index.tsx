import React from 'react';
import './index.css';
import TagView from './tag';
import useTagPage from '../../../hooks/useTagPage';
import AskQuestionButton from '../askQuestionButton';
import SideBarNav from '../sideBarNav';

/**
 * Represents the TagPage component which displays a list of tags
 * and provides functionality to handle tag clicks and ask a new question.
 */
const TagPage = () => {
  const { tlist, clickTag } = useTagPage();

  const styles = {
    container: 'flex flex-col md:flex-row',
    sideBarContainer: 'md:w-2/12',
    tagContainer: 'md:w-10/12',
    topRowContainer: 'flex justify-between mt-2 px-2',
    topRowText: 'bold_title my-4',
    tagList: 'tag_list right_padding',
  };

  return (
    <div className={styles.container}>
      <div className={styles.sideBarContainer}>
        <SideBarNav />
      </div>
      <div className={styles.tagContainer}>
        <div className={styles.topRowContainer}>
          <div className={styles.topRowText}>{tlist.length} Tags</div>
          <div className={styles.topRowText}>All Tags</div>
          <AskQuestionButton />
        </div>
        <div className={styles.tagList}>
          {tlist.map((t, idx) => (
            <TagView key={idx} t={t} clickTag={clickTag} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagPage;
