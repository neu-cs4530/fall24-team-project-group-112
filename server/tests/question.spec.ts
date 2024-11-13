import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Question } from '../types';

const addVoteToQuestionSpy = jest.spyOn(util, 'addVoteToQuestion');

interface MockResponse {
  msg: string;
  upVotes: string[];
  downVotes: string[];
}

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1',
  description: 'Tag 1 Description',
};
const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'tag2',
  description: 'Tag 2 Description',
};

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ansBy: 'answer1_user',
  ansDateTime: '2024-06-09',
  comments: [],
};

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ansBy: 'answer2_user',
  ansDateTime: '2024-06-10',
  comments: [],
};

const ans3 = {
  _id: '65e9b58910afe6e94fc6e6df',
  text: 'Answer 3 Text',
  ansBy: 'answer3_user',
  ansDateTime: '2024-06-11',
  comments: [],
};

const ans4 = {
  _id: '65e9b58910afe6e94fc6e6dg',
  text: 'Answer 4 Text',
  ansBy: 'answer4_user',
  ansDateTime: '2024-06-14',
  comments: [],
};

const ans5 = {
  _id: '67299762bd1ee03e4572754b',
  text: 'Answer 5 Text',
  ansBy: 'answer4_user',
  ansDateTime: '2024-06-14',
  comments: [],
};

const MOCK_QUESTIONS = [
  {
    _id: '65e9b58910afe6e94fc6e6dc',
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [ans1],
    askedBy: 'question1_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user'],
    upVotes: ['question2_user'],
    downVotes: ['question3_user'],
    comments: [],
  },
  {
    _id: '65e9b5a995b6c7045a30d823',
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2, ans3, ans5],
    askedBy: 'question2_user',
    askDateTime: new Date('2024-06-04'),
    views: ['question1_user', 'question2_user'],
    upVotes: ['question1_user'],
    downVotes: ['question3_user'],
    comments: [],
  },
  {
    _id: '34e9b58910afe6e94fc6e99f',
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [ans4],
    askedBy: 'question3_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user', 'question3_user'],
    upVotes: ['question1_user'],
    downVotes: ['question2_user'],
    comments: [],
  },
];

describe('POST /upvoteQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should upvote a question successfully', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    const mockResponse = {
      msg: 'Question upvoted successfully',
      upVotes: ['new-user'],
      downVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    const response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should cancel the upvote successfully', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
      username: 'some-user',
    };

    const mockSecondResponse = {
      msg: 'Upvote cancelled successfully',
      upVotes: [],
      downVotes: [],
    };

    await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    addVoteToQuestionSpy.mockResolvedValueOnce(mockSecondResponse);

    const response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSecondResponse);
  });

  it('should handle upvote and then downvote by the same user', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    // First upvote the question
    let mockResponseWithBothVotes: MockResponse = {
      msg: 'Question upvoted successfully',
      upVotes: ['new-user'],
      downVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

    let response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponseWithBothVotes);

    // Now downvote the question
    mockResponseWithBothVotes = {
      msg: 'Question downvoted successfully',
      downVotes: ['new-user'],
      upVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

    response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponseWithBothVotes);
  });

  it('should return bad request error if the request had qid missing', async () => {
    const mockReqBody = {
      username: 'some-user',
    };

    const response = await supertest(app).post(`/question/upvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had username missing', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const response = await supertest(app).post(`/question/upvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('POST /downvoteQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should downvote a question successfully', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    const mockResponse = {
      msg: 'Question upvoted successfully',
      downVotes: ['new-user'],
      upVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    const response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should cancel the downvote successfully', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
      username: 'some-user',
    };

    const mockSecondResponse = {
      msg: 'Downvote cancelled successfully',
      downVotes: [],
      upVotes: [],
    };

    await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    addVoteToQuestionSpy.mockResolvedValueOnce(mockSecondResponse);

    const response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSecondResponse);
  });

  it('should handle downvote and then upvote by the same user', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    // First downvote the question
    let mockResponse: MockResponse = {
      msg: 'Question downvoted successfully',
      downVotes: ['new-user'],
      upVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    let response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);

    // Then upvote the question
    mockResponse = {
      msg: 'Question upvoted successfully',
      downVotes: [],
      upVotes: ['new-user'],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return bad request error if the request had qid missing', async () => {
    const mockReqBody = {
      username: 'some-user',
    };

    const response = await supertest(app).post(`/question/downvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had username missing', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const response = await supertest(app).post(`/question/downvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('GET /getQuestionById/:qid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return a question object in the response when the question id is passed as request parameter', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
    const mockReqQuery = {
      username: 'question3_user',
    };

    const findq = MOCK_QUESTIONS.filter(q => q._id.toString() === mockReqParams.qid)[0];

    const mockPopulatedQuestion = {
      ...findq,
      _id: new mongoose.Types.ObjectId(findq._id),
      views: ['question1_user', 'question2_user', 'question3_user'],
      tags: [],
      answers: [],
      askDateTime: findq.askDateTime,
    };

    // Provide mock question data
    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockResolvedValueOnce(mockPopulatedQuestion as Question);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    const expectedResponse = {
      ...mockPopulatedQuestion,
      _id: mockPopulatedQuestion._id.toString(),
      askDateTime: mockPopulatedQuestion.askDateTime.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should not return a question object with a duplicated user in the views if the user is viewing the same question again', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
    const mockReqQuery = {
      username: 'question2_user',
    };

    const findq = MOCK_QUESTIONS.filter(q => q._id.toString() === mockReqParams.qid)[0];

    const mockPopulatedQuestion = {
      ...findq,
      _id: new mongoose.Types.ObjectId(findq._id),
      tags: [],
      answers: [],
      askDateTime: findq.askDateTime,
    };

    // Provide mock question data
    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockResolvedValueOnce(mockPopulatedQuestion as Question);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    const expectedResponse = {
      ...mockPopulatedQuestion,
      _id: mockPopulatedQuestion._id.toString(),
      askDateTime: mockPopulatedQuestion.askDateTime.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if the question id is not in the correct format', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: 'invalid id',
    };
    const mockReqQuery = {
      username: 'question2_user',
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return bad request error if the username is not provided', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(`/question/getQuestionById/${mockReqParams.qid}`);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid username requesting question.');
  });

  it('should return database error if the question id is not found in the database', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
    const mockReqQuery = {
      username: 'question2_user',
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request error if an error occurs when fetching and updating the question', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
    const mockReqQuery = {
      username: 'question2_user',
    };

    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockResolvedValueOnce({ error: 'Error when fetching and updating a question' });

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    // Asserting the response
    expect(response.status).toBe(500);
  });
});

describe('GET /answeredBy/:username', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return a list of questions answered by the specified username', async () => {
    const mockReqParams = { username: 'answer4_user' };
    const mockQuestions = MOCK_QUESTIONS.map(q => ({
      ...q,
      _id: new mongoose.Types.ObjectId(q._id),
      tags: q.tags,
      answers: q.answers,
      askDateTime: new Date(q.askDateTime),
    })).filter(q => q.answers.some(a => a.ansBy === mockReqParams.username));
    const mockPopulatedQuestions = mockQuestions.map(question => ({
      ...question,
      _id: new mongoose.Types.ObjectId(question._id),
      views: ['question1_user', 'question2_user', 'question3_user'],
      tags: [],
      answers: [],
      askDateTime: question.askDateTime,
    }));

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(false);
    jest.spyOn(util, 'findQuestionAnsweredBy').mockResolvedValue(mockPopulatedQuestions);

    const response = await supertest(app).get(`/question/answeredBy/${mockReqParams.username}`);

    const expectedResponse = mockPopulatedQuestions.map(question => ({
      ...question,
      _id: question._id.toString(),
      askDateTime: question.askDateTime.toISOString(),
    }));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if username is not provided or invalid', async () => {
    const mockReqParams = { username: 'invalid_user' };

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(true);

    const response = await supertest(app).get(`/question/answeredBy/${mockReqParams.username}`);

    expect(response.status).toBe(400);
    expect(response.text).toBe('User with provided username is invalid');
  });

  it('should return empty array if the username exists but has no questions answered', async () => {
    const mockReqParams = { username: 'no_questions_user' };

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(false);
    jest.spyOn(util, 'findQuestionAnsweredBy').mockResolvedValue([]);

    const response = await supertest(app).get(`/question/answeredBy/${mockReqParams.username}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return server error if an error occurs while fetching questions', async () => {
    const mockReqParams = { username: 'question3_user' };

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(false);
    jest.spyOn(util, 'findQuestionAnsweredBy').mockImplementation(() => {
      throw new Error('Error while fetching question answered by user');
    });

    const response = await supertest(app).get(`/question/answeredBy/${mockReqParams.username}`);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching question answered by user');
  });
});

describe('GET /askedBy/:username', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return a list of questions asked by the specified username', async () => {
    const mockReqParams = { username: 'question3_user' };
    const mockQuestions = MOCK_QUESTIONS.filter(q => q.askedBy === mockReqParams.username);

    const mockPopulatedQuestions = mockQuestions.map(question => ({
      ...question,
      _id: new mongoose.Types.ObjectId(question._id),
      views: ['question1_user', 'question2_user', 'question3_user'],
      tags: [],
      answers: [],
      askDateTime: question.askDateTime,
    }));

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(false);
    jest.spyOn(util, 'findQuestionAskedBy').mockResolvedValue(mockPopulatedQuestions);

    const response = await supertest(app).get(`/question/askedBy/${mockReqParams.username}`);

    const expectedResponse = mockPopulatedQuestions.map(question => ({
      ...question,
      _id: question._id.toString(),
      askDateTime: question.askDateTime.toISOString(),
    }));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if username is not provided or invalid', async () => {
    const mockReqParams = { username: 'invalid_user' };

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(true);

    const response = await supertest(app).get(`/question/askedBy/${mockReqParams.username}`);

    expect(response.status).toBe(400);
    expect(response.text).toBe('User with provided username is invalid');
  });

  it('should return empty array if the username exists but has no questions asked', async () => {
    const mockReqParams = { username: 'no_questions_user' };

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(false);
    jest.spyOn(util, 'findQuestionAskedBy').mockResolvedValue([]);

    const response = await supertest(app).get(`/question/askedBy/${mockReqParams.username}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return server error if an error occurs while fetching questions', async () => {
    const mockReqParams = { username: 'question3_user' };

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(false);
    jest.spyOn(util, 'findQuestionAskedBy').mockImplementation(() => {
      throw new Error('Error while fetching question asked by user');
    });

    const response = await supertest(app).get(`/question/askedBy/${mockReqParams.username}`);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching question asked by user');
  });
});

describe('GET /downvotedBy/:username', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
  });

  it('should return a list of questions downvoted by the specified username', async () => {
    const mockReqParams = { username: 'question2_user' };
    const mockQuestions = MOCK_QUESTIONS.filter(q => q.downVotes.includes(mockReqParams.username));

    const mockPopulatedQuestions = mockQuestions.map(question => ({
      ...question,
      _id: new mongoose.Types.ObjectId(question._id),
      tags: [],
      answers: [],
      askDateTime: question.askDateTime,
    }));

    jest.spyOn(util, 'findQuestionDownvotedBy').mockResolvedValue(mockPopulatedQuestions);

    const response = await supertest(app).get(`/question/downvotedBy/${mockReqParams.username}`);

    const expectedResponse = mockPopulatedQuestions.map(question => ({
      ...question,
      _id: question._id.toString(),
      askDateTime: question.askDateTime.toISOString(),
    }));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
    expect(response.body.length).toBe(mockPopulatedQuestions.length);
  });

  it('should return bad request error if username is not provided or invalid', async () => {
    const mockReqParams = { username: 'fake_user' };

    jest.spyOn(util, 'findQuestionDownvotedBy').mockResolvedValue({ error: 'User does not exist' });

    const response = await supertest(app).get(`/question/downvotedBy/${mockReqParams.username}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when fetching question downvoted by user: User does not exist',
    );
  });

  it('should return empty array if the username exists but has no questions downvoted', async () => {
    const mockReqParams = { username: 'question1_user' };

    jest.spyOn(util, 'findQuestionDownvotedBy').mockResolvedValue([]);

    const response = await supertest(app).get(`/question/downvotedBy/${mockReqParams.username}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return server error if an error occurs while fetching questions', async () => {
    const mockReqParams = { username: 'question2_user' };

    jest.spyOn(util, 'findQuestionDownvotedBy').mockImplementation(() => {
      throw new Error('Error while fetching question downvoted by user');
    });

    const response = await supertest(app).get(`/question/downvotedBy/${mockReqParams.username}`);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching question downvoted by user');
  });

  it('should return an error if no user is provided', async () => {
    const response = await supertest(app).get(`/question/downvotedBy/`);

    expect(response.status).toBe(404);
  });
});

describe('GET /upvotedBy/:username', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
  });

  it('should return a list of questions upvoted by the specified username', async () => {
    const mockReqParams = { username: 'question2_user' };
    const mockQuestions = MOCK_QUESTIONS.filter(q => q.upVotes.includes(mockReqParams.username));

    const mockPopulatedQuestions = mockQuestions.map(question => ({
      ...question,
      _id: new mongoose.Types.ObjectId(question._id),
      tags: [],
      answers: [],
      askDateTime: question.askDateTime,
    }));

    jest.spyOn(util, 'findQuestionUpvotedBy').mockResolvedValue(mockPopulatedQuestions);

    const response = await supertest(app).get(`/question/upvotedBy/${mockReqParams.username}`);

    const expectedResponse = mockPopulatedQuestions.map(question => ({
      ...question,
      _id: question._id.toString(),
      askDateTime: question.askDateTime.toISOString(),
    }));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
    expect(response.body.length).toBe(mockPopulatedQuestions.length);
  });

  it('should return bad request error if username is not provided or invalid', async () => {
    const mockReqParams = { username: 'fake_user' };

    jest.spyOn(util, 'findQuestionUpvotedBy').mockResolvedValue({ error: 'User does not exist' });

    const response = await supertest(app).get(`/question/upvotedBy/${mockReqParams.username}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when fetching question upvoted by user: User does not exist');
  });

  it('should return empty array if the username exists but has no questions upvoted', async () => {
    const mockReqParams = { username: 'question3_user' };

    jest.spyOn(util, 'findQuestionUpvotedBy').mockResolvedValue([]);

    const response = await supertest(app).get(`/question/upvotedBy/${mockReqParams.username}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return server error if an error occurs while fetching questions', async () => {
    const mockReqParams = { username: 'question2_user' };

    jest.spyOn(util, 'findQuestionUpvotedBy').mockImplementation(() => {
      throw new Error('Error while fetching question upvoted by user');
    });

    const response = await supertest(app).get(`/question/upvotedBy/${mockReqParams.username}`);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching question upvoted by user');
  });

  it('should return an error if no user is provided', async () => {
    const response = await supertest(app).get(`/question/upvotedBy/`);

    expect(response.status).toBe(404);
  });
});
