import React from 'react';
import { Follow, FeedPost, Question } from '../../../../../types';
import './index.css';
import CommentItem from '../../activityComponents/comment';
import FollowItem from '../../activityComponents/follow';
import AnswerItem from '../../activityComponents/answer';
import QuestionItem from '../../activityComponents/question';

interface FeedItemProps {
  feedItem: FeedPost;
}

const FeedItem: React.FC<FeedItemProps> = ({ feedItem }) => {
  let content;

  switch (feedItem.postType) {
    case 'Answer': {
      const question = feedItem.event as Question;
      const answer = (feedItem.event as Question).answers[0];
      content = <AnswerItem answer={answer} question={question} itemType='feed' />;
      break;
    }
    case 'Comment': {
      const question = feedItem.event as Question;
      const comment = (feedItem.event as Question).comments[0];
      content = <CommentItem comment={comment} question={question} itemType='feed' />;
      break;
    }
    case 'Follow': {
      const follow = feedItem.event as Follow;
      content = <FollowItem follow={follow} itemType='feed' />;
      break;
    }
    case 'Question': {
      const question = feedItem.event as Question;
      content = <QuestionItem question={question} />;
      break;
    }
    default: {
      content = <div>New notification received.</div>;
    }
  }

  return <div className='padding'>{content}</div>;
};

export default FeedItem;
