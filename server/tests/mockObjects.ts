import { ObjectId } from 'mongodb';

export const feedUser = {
  username: 'user1',
  firstName: 'User',
  lastName: 'One',
  email: 'user1@email.com',
  badges: [],
  createdAt: new Date('2024-06-04'),
};

export const FOLLOWS = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
    followerUsername: 'user1',
    followeeUsername: 'user2',
    followDateTime: new Date('2023-11-19T09:24:00Z'),
  },
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e7de'),
    followerUsername: 'user2',
    followeeUsername: 'user1',
    followDateTime: new Date('2023-11-19T09:24:00Z'),
  },
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e7de'),
    followerUsername: 'user1',
    followeeUsername: 'com_by1',
    followDateTime: new Date('2023-11-19T09:24:00Z'),
  },
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e7de'),
    followerUsername: 'user1',
    followeeUsername: 'ansBy1',
    followDateTime: new Date('2023-11-19T09:24:00Z'),
  },
];

export const populatedQuestion1 = {
  _id: '67344ba3ddbe5d4e5923898e',
  title: 'question 10',
  text: 'question 10 text',
  askedBy: 'ro',
  askDateTime: new Date('2024-11-13T06:48:03.273Z'),
  user: {
    _id: '6723db97653dc38b6311243d',
    username: 'ro',
    firstName: 'aarohi',
    lastName: 'nad',
  },
  answers: [],
  comments: [],
};

export const populatedQuestionPost1 = {
  postType: 'Question',
  event: {
    _id: '67344ba3ddbe5d4e5923898e',
    title: 'question 10',
    text: 'question 10 text',
    askedBy: 'ro',
    askDateTime: new Date('2024-11-13T06:48:03.273Z'),
    user: {
      _id: '6723db97653dc38b6311243d',
      username: 'ro',
      firstName: 'aarohi',
      lastName: 'nad',
    },
    tags: [],
    answers: [],
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [],
    id: '67344ba3ddbe5d4e5923898e',
  },
  date: new Date('2024-11-13T06:48:03.273Z'),
};

export const populatedComment1 = {
  _id: '67342e8433d0ec18863bcb1d',
  title: 'how will we do on this project',
  text: "i wonder what grade we'll get...",
  askedBy: 'dessy',
  askDateTime: '2024-11-13T04:43:48.635Z',
  comments: [
    {
      _id: '6734f0b8c29924fef7d81a05',
      text: 'such a great question',
      commentBy: 'saltyPeter',
      commentDateTime: '2024-11-13T18:32:23.639Z',
      __v: 0,
      user: {
        _id: '672cd523bd9ffdd6d609bc0f',
        username: 'saltyPeter',
        firstName: 'peter',
        lastName: 'griffin',
      },
      id: '6734f0b8c29924fef7d81a05',
    },
  ],
  user: {
    _id: '672a8fd1efb7ad71bbc89f8c',
    username: 'dessy',
    firstName: 'Dessy',
    lastName: 'D',
    avatarName: 'avatar3',
  },
  id: '67342e8433d0ec18863bcb1d',
  latestComDateTime: '2024-11-13T18:32:23.639Z',
};

export const populatedCommentPost1 = {
  postType: 'Comment',
  event: {
    _id: '67342e8433d0ec18863bcb1d',
    title: 'how will we do on this project',
    text: "i wonder what grade we'll get...",
    askedBy: 'dessy',
    askDateTime: '2024-11-13T04:43:48.635Z',
    comments: [
      {
        _id: '6734f0b8c29924fef7d81a05',
        text: 'such a great question',
        commentBy: 'saltyPeter',
        commentDateTime: '2024-11-13T18:32:23.639Z',
        __v: 0,
        user: {
          _id: '672cd523bd9ffdd6d609bc0f',
          username: 'saltyPeter',
          firstName: 'peter',
          lastName: 'griffin',
        },
        id: '6734f0b8c29924fef7d81a05',
      },
    ],
    user: {
      _id: '672a8fd1efb7ad71bbc89f8c',
      username: 'dessy',
      firstName: 'Dessy',
      lastName: 'D',
      avatarName: 'avatar3',
    },
    id: '67342e8433d0ec18863bcb1d',
    latestComDateTime: '2024-11-13T18:32:23.639Z',
  },
  date: '2024-11-13T18:32:23.639Z',
};

export const populatedAnswer1 = {
  _id: '6733f14f13f3d406daa44f2f',
  title: "What's for lunch?",
  text: 'I really want food',
  answers: [
    {
      _id: '6734e27559758923c1a69782',
      text: 'fooddddddd',
      ansBy: 'ro',
      ansDateTime: new Date('2024-11-13T17:31:33.145Z'),
      user: {
        _id: '6723db97653dc38b6311243d',
        username: 'ro',
        firstName: 'aarohi',
        lastName: 'nad',
      },
      id: '6734e27559758923c1a69782',
    },
  ],
  askedBy: 'liangjimenez',
  askDateTime: new Date('2024-11-13T00:22:38.938Z'),
  user: {
    _id: '672d303c719a608cdb0e1e0c',
    username: 'liangjimenez',
    firstName: 'Liang',
    lastName: 'Jimenez',
  },
};

export const populatedAnswerPost1 = {
  postType: 'Answer',
  event: {
    _id: '6733f14f13f3d406daa44f2f',
    title: "What's for lunch?",
    text: 'I really want food',
    answers: [
      {
        _id: '6734e27559758923c1a69782',
        text: 'fooddddddd',
        ansBy: 'ro',
        ansDateTime: new Date('2024-11-13T17:31:33.145Z'),
        user: {
          _id: '6723db97653dc38b6311243d',
          username: 'ro',
          firstName: 'aarohi',
          lastName: 'nad',
        },
        id: '6734e27559758923c1a69782',
      },
    ],
    askedBy: 'liangjimenez',
    askDateTime: new Date('2024-11-13T00:22:38.938Z'),
    user: {
      _id: '672d303c719a608cdb0e1e0c',
      username: 'liangjimenez',
      firstName: 'Liang',
      lastName: 'Jimenez',
    },
    id: '6733f14f13f3d406daa44f2f',
  },
  date: new Date('2024-11-13T17:31:33.145Z'),
};

export const populatedFollowPost1 = {
  postType: 'Follow',
  event: {
    _id: '6734ec02574cdbc9a5fa5e40',
    followerUsername: 'aarohi',
    followeeUsername: 'dessy',
    followDateTime: new Date('2024-11-13T18:12:17.902Z'),
    __v: 0,
    follower: {
      _id: '67285a241c61c008d8846c6f',
      username: 'aarohi',
      firstName: 'aarohi',
      lastName: 'nad',
      avatarName: 'avatar2',
    },
    followee: {
      _id: '672a8fd1efb7ad71bbc89f8c',
      username: 'dessy',
      firstName: 'Dessy',
      lastName: 'D',
      avatarName: 'avatar3',
    },
    id: '6734ec02574cdbc9a5fa5e40',
  },
  date: new Date('2024-11-13T18:12:17.902Z'),
};

export const FULL_FEED = [
  {
    date: '2024-11-13T06:48:03.273Z',
    event: {
      _id: '67344ba3ddbe5d4e5923898e',
      answers: [],
      askDateTime: '2024-11-13T06:48:03.273Z',
      askedBy: 'ro',
      comments: [],
      downVotes: [],
      id: '67344ba3ddbe5d4e5923898e',
      tags: [],
      text: 'question 10 text',
      title: 'question 10',
      upVotes: [],
      user: {
        _id: '6723db97653dc38b6311243d',
        firstName: 'aarohi',
        lastName: 'nad',
        username: 'ro',
      },
      views: [],
    },
    postType: 'Question',
  },
  {
    date: '2023-11-19T09:24:00.000Z',
    event: {
      _id: '65e9b58910afe6e94fc6e6df',
      followDateTime: '2023-11-19T09:24:00.000Z',
      followeeUsername: 'user2',
      followerUsername: 'user1',
      id: '65e9b58910afe6e94fc6e6df',
    },
    postType: 'Follow',
  },
  {
    date: '2023-11-19T09:24:00.000Z',
    event: {
      _id: '65e9b58910afe6e94fc6e7de',
      followDateTime: '2023-11-19T09:24:00.000Z',
      followeeUsername: 'user1',
      followerUsername: 'user2',
      id: '65e9b58910afe6e94fc6e7de',
    },
    postType: 'Follow',
  },
  {
    date: '2023-11-19T09:24:00.000Z',
    event: {
      _id: '65e9b58910afe6e94fc6e7de',
      followDateTime: '2023-11-19T09:24:00.000Z',
      followeeUsername: 'com_by1',
      followerUsername: 'user1',
      id: '65e9b58910afe6e94fc6e7de',
    },
    postType: 'Follow',
  },
  {
    date: '2023-11-19T09:24:00.000Z',
    event: {
      _id: '65e9b58910afe6e94fc6e7de',
      followDateTime: '2023-11-19T09:24:00.000Z',
      followeeUsername: 'ansBy1',
      followerUsername: 'user1',
      id: '65e9b58910afe6e94fc6e7de',
    },
    postType: 'Follow',
  },
];
