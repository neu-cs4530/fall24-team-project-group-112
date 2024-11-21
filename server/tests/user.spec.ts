import mongoose from 'mongoose';
import supertest from 'supertest';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../app';
import UserModel from '../models/users';
import FollowModel from '../models/follows';
import * as util from '../models/application';
import {
  feedUser,
  FOLLOWS,
  FULL_FEED,
  populatedAnswer1,
  populatedComment1,
  populatedQuestion1,
} from './mockObjects';
import QuestionModel from '../models/questions';
import AnswerModel from '../models/answers';
import CommentModel from '../models/comments';
import BadgeModel from '../models/badges';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const USER = {
  _id: '67325222c2afe26a6ab97909',
  badges: [],
  username: 'dummyUser',
  firstName: 'Dummy',
  lastName: 'User',
  email: 'dummy@gmail.com',
  createdAt: new Date('2024-06-03'),
  headline: 'Software engineer',
  bio: 'Software engineer in Boston',
};

const USER2 = {
  _id: '51325222c2afe26a6ab97910',
  badges: [],
  username: 'otherUser',
  firstName: 'Other',
  lastName: 'User',
  email: 'other@gmail.com',
  createdAt: new Date('2024-06-03'),
  headline: 'Software engineer',
  bio: 'Software engineer in Cambridge',
};

const findOneSpy = jest.spyOn(UserModel, 'findOne');

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));
const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.Mock;

describe('POST /login', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should login a user via firebase and return the user', async () => {
    const mockReqBody = {
      email: 'testuser@email.com',
      password: '123456',
    };

    mockSignInWithEmailAndPassword.mockResolvedValueOnce('testuser@email.com');

    const mockUser = {
      _id: '67325222c2afe26a6ab97909',
      badges: [],
      username: 'testuser',
      email: mockReqBody.email,
    };
    mockingoose(UserModel).toReturn(mockUser, 'findOne');

    const response = await supertest(app).post('/user/login').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      undefined,
      mockReqBody.email,
      mockReqBody.password,
    );
  });

  it('should return an error if the request is empty', async () => {
    const mockReqBodyError = {};

    const response = await supertest(app).post('/user/login').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return an error if the email is missing', async () => {
    const mockReqBodyError = {
      password: '123456',
    };

    const response = await supertest(app).post('/user/login').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return an error if the password is missing', async () => {
    const mockReqBodyError = {
      email: 'testemail@email.com',
    };

    const response = await supertest(app).post('/user/login').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return an error if the login credentials are incorrect', async () => {
    const mockReqBodyError = {
      email: 'testuser@wrong.com',
      password: 'wrongpassword',
    };

    mockSignInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid email or password'));

    const response = await supertest(app).post('/user/login').send(mockReqBodyError);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Login error: Invalid email or password');
  });
});

describe('PATCH /:username', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  const username = 'dummyUser';
  const mockUser = {
    _id: '67325222c2afe26a6ab97909',
    badges: [],
    username,
    firstName: 'Dummy',
    lastName: 'User',
    email: 'dummy@gmail.com',
    createdAt: new Date('2024-06-03').toISOString(),
    headline: 'Software engineer',
    bio: 'Software engineer in Boston',
  };

  it('should update a user with the given username', async () => {
    const cityUpdate = 'Boston';
    const mockReqBody = {
      city: cityUpdate,
    };

    mockingoose(UserModel).toReturn(mockUser, 'findOne');
    const expectedResult = { user: { ...mockUser, city: cityUpdate } };
    mockingoose(UserModel).toReturn(expectedResult, 'findOneAndUpdate');
    mockingoose(BadgeModel).toReturn({ name: 'VOTER', description: 'voter badge' }, 'findOne');

    const response = await supertest(app).patch(`/user/${username}`).send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResult);
    // updated user should have the provided user
    expect(response.body.user.username).toBe(username);
    // city should have been updated
    expect(response.body.user.city).toBe(cityUpdate);
    // other fields should not have changed
    expect(response.body.user.email).toBe(mockUser.email);
    expect(response.body.user.firstName).toBe(mockUser.firstName);
    expect(response.body.user.lastName).toBe(mockUser.lastName);
  });

  it('should return an error if no user is provided', async () => {
    const mockReqBody = {
      city: 'Boston',
    };
    const response = await supertest(app).patch(`/user/`).send(mockReqBody);

    expect(response.status).toBe(404); // route is not matched
  });

  it('should return an error if provided user does not exist', async () => {
    const mockReqBody = {
      city: 'Boston',
    };

    mockingoose.resetAll(); // make sure an existing mock isn't still set
    const response = await supertest(app).patch(`/user/fakeUsername`).send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toContain('User does not exist');
  });

  it('should return the original object if all profile fields are empty', async () => {
    mockingoose(UserModel).toReturn(mockUser, 'findOne');
    const response = await supertest(app).patch(`/user/${username}`).send();

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject(mockUser);
  });

  it('should update all fields properly', async () => {
    const mockReqBody = {
      headline: 'Aspiring software engineer',
      bio: 'Software engineer in Boston looking to connect with other engineers',
      githubUrl: 'www.github.com',
      company: 'Google',
      school: 'Northeastern University',
      city: 'Boston',
      state: 'Massachusetts',
      avatarName: 'avatar1',
    };

    mockingoose(UserModel).toReturn(mockUser, 'findOne');
    const expectedResult = { ...mockUser, ...mockReqBody };
    mockingoose(UserModel).toReturn(expectedResult, 'findOneAndUpdate');
    mockingoose(BadgeModel).toReturn({ name: 'VOTER', description: 'voter badge' }, 'findOne');

    const response = await supertest(app).patch(`/user/${username}`).send(mockReqBody);
    expect(response.body.user).toMatchObject(expectedResult);
  });
  it('should handle a partial update properly', async () => {
    const cityUpdate = 'Boston';
    const mockReqBody = {
      city: cityUpdate,
    };

    mockingoose(UserModel).toReturn(mockUser, 'findOne');
    const expectedResult = { ...mockUser, city: cityUpdate };
    mockingoose(UserModel).toReturn(expectedResult, 'findOneAndUpdate');
    mockingoose(BadgeModel).toReturn({ name: 'VOTER', description: 'voter badge' }, 'findOne');

    const response = await supertest(app).patch(`/user/${username}`).send(mockReqBody);

    expect(response.status).toBe(200);
    // updated user should have the provided user
    expect(response.body.user.username).toBe(username);
    // city should have been updated
    expect(response.body.user.city).toBe(cityUpdate);
    // other updatable fields should not have changed
    expect(response.body.user.headline).toBe(mockUser.headline);
    expect(response.body.user.bio).toBe(mockUser.bio);
  });
});

describe('POST /follow', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  const mockUser1 = {
    username: 'user1',
    firstName: 'User',
    lastName: 'One',
    email: 'user1@email.com',
    badges: [],
    createdAt: new Date('2024-06-04'),
  };

  const mockUser2 = {
    username: 'user2',
    firstName: 'User',
    lastName: 'Two',
    email: 'userTwo@email.com',
    badges: [],
    createdAt: new Date('2024-06-03'),
  };

  const mockFollow = {
    followerUsername: 'user1',
    followeeUsername: 'user2',
    followDate: new Date('2024-06-04'),
  };

  it('should create a follow request if one does not already exist for the given follower and followee', async () => {
    const mockReqBody = {
      followerUsername: 'user1',
      followeeUsername: 'user2',
    };

    mockingoose(UserModel).toReturn([mockUser1, mockUser2], 'findOne');
    mockingoose(FollowModel).toReturn(null, 'findOne');

    const response = await supertest(app).post(`/user/follow`).send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body.success).toEqual('Follow request created');
  });

  it('should delete a follow request if one already exists for the given follower and followee', async () => {
    const mockReqBody = {
      followerUsername: 'user1',
      followeeUsername: 'user2',
    };

    mockingoose(UserModel).toReturn([mockUser1, mockUser2], 'findOne');
    mockingoose(FollowModel).toReturn(mockFollow, 'findOne');

    const response = await supertest(app).post(`/user/follow`).send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body.success).toEqual('Follow request deleted');
  });

  it('should return an error if an empty request is provided', async () => {
    const mockReqBody = {};
    const response = await supertest(app).post(`/user/follow`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return an error if request is missing a follower username', async () => {
    const mockReqBody = {
      followeeUsername: 'user2',
    };
    const response = await supertest(app).post(`/user/follow`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return an error if request is missing a followee username', async () => {
    const mockReqBody = {
      followerUsername: 'user1',
    };
    const response = await supertest(app).post(`/user/follow`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return an error if provided user does not exist', async () => {
    const mockReqBody = {
      followerUsername: 'user1',
      followeeUsername: 'fakeuser',
    };

    mockingoose(UserModel).toReturn(null, 'findOne');

    const response = await supertest(app).post(`/user/follow`).send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toContain(
      'Error when creating/deleting follow request: Error when creating or deleting a follow request',
    );
  });
});

describe('GET /follow/:username', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Ensure connection is properly closed
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return a server error if there is an issue fetching followers and following', async () => {
    const mockReqParams = { username: 'johnDoe' };

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(true);

    const response = await supertest(app).get(`/user/follow/${mockReqParams.username}`);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching followers and following');
  });

  it('should return 500 if the username does not exist', async () => {
    const mockReqParams = { username: 'invalid_user' };

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(false);

    const response = await supertest(app).get(`/user/follow/${mockReqParams.username}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when fetching followers and following: Error when getting followers and following: Invalid username',
    );
  });

  it('should return a list of followers and people the user is following', async () => {
    const mockReqParams = { username: 'johnDoe' };

    const mockFollowers = [
      {
        followerUsername: 'follower1',
        followeeUsername: 'johnDoe',
        followDateTime: new Date('2024-06-01T00:00:00.000Z'),
      },
      {
        followerUsername: 'follower2',
        followeeUsername: 'johnDoe',
        followDateTime: new Date('2024-06-02T00:00:00.000Z'),
      },
    ];

    const mockFollowing = [
      {
        followerUsername: 'johnDoe',
        followeeUsername: 'following1',
        followDateTime: new Date('2024-06-01T00:00:00.000Z'),
      },
      {
        followerUsername: 'johnDoe',
        followeeUsername: 'following2',
        followDateTime: new Date('2024-06-02T00:00:00.000Z'),
      },
    ];

    jest.spyOn(util, 'getFollowersAndFollowingForUser').mockResolvedValue({
      followers: mockFollowers,
      following: mockFollowing,
    });

    const response = await supertest(app).get(`/user/follow/${mockReqParams.username}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      followers: mockFollowers.map(f => ({ ...f, followDateTime: f.followDateTime.toISOString() })),
      following: mockFollowing.map(f => ({ ...f, followDateTime: f.followDateTime.toISOString() })),
    });
  });

  it('should return 404 if the username is missing', async () => {
    const response = await supertest(app).get('/user/follow/');

    expect(response.status).toBe(404);
  });

  it('should return empty arrays if the user exists but has no followers or following', async () => {
    const mockReqParams = { username: 'no_followers_user' };

    jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(true);

    jest
      .spyOn(util, 'getFollowersAndFollowingForUser')
      .mockResolvedValue({ followers: [], following: [] });

    const response = await supertest(app).get(`/user/follow/${mockReqParams.username}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      followers: [],
      following: [],
    });
  });
});

describe('GET /getUserByName/:name', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the user when found', async () => {
    const newUser = {
      username: 'dummyUser',
      lastName: 'User',
      email: 'dummy@example.com',
      createdAt: '2024-06-03T00:00:00.000Z',
    };

    findOneSpy.mockResolvedValueOnce(newUser);

    const response = await supertest(app).get('/user/dummyUser');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(newUser);
  });

  it('should return 404 if the user is not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).get('/user/nonExistentUser');

    expect(response.status).toBe(404);
    expect(response.text).toBe('User with the username "nonExistentUser" not found');
  });

  it('should return 500 if there is an error fetching the user', async () => {
    findOneSpy.mockRejectedValueOnce(new Error('Error fetching user'));

    const response = await supertest(app).get('/user/errorUser');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching user: Error fetching user');
  });

  it('should return an error if the request is empty', async () => {
    const response = await supertest(app).get('/user/');

    expect(response.status).toBe(404);
  });
});

describe('GET /getFeed/:username', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Ensure connection is properly closed
  });

  it('should return the feed for a user with no filter provided', async () => {
    mockingoose(UserModel).toReturn(feedUser, 'findOne');
    mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
    mockingoose(QuestionModel).toReturn([populatedQuestion1], 'find');
    mockingoose(AnswerModel).toReturn([populatedAnswer1], 'find');
    mockingoose(CommentModel).toReturn([populatedComment1], 'find');

    const response = await supertest(app).get('/user/feed/user1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(FULL_FEED);
  });

  it('should return the feed for a user with the question filter provided', async () => {
    mockingoose(UserModel).toReturn(feedUser, 'findOne');
    mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
    mockingoose(QuestionModel).toReturn([populatedQuestion1], 'find');

    const expectedResult = FULL_FEED.filter(post => post.postType === 'Question');

    const response = await supertest(app).get('/user/feed/user1?postType=Question');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResult);
  });

  it('should return the feed for a user with the answer filter provided', async () => {
    mockingoose(UserModel).toReturn(feedUser, 'findOne');
    mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
    mockingoose(QuestionModel).toReturn([populatedQuestion1], 'find');
    mockingoose(AnswerModel).toReturn([populatedAnswer1], 'find');

    const expectedResult = FULL_FEED.filter(post => post.postType === 'Answer');

    const response = await supertest(app).get('/user/feed/user1?postType=Answer');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResult);
  });

  it('should return the feed for a user with the comment filter provided', async () => {
    mockingoose(UserModel).toReturn(feedUser, 'findOne');
    mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
    mockingoose(QuestionModel).toReturn([populatedQuestion1], 'find');
    mockingoose(CommentModel).toReturn([populatedComment1], 'find');

    const expectedResult = FULL_FEED.filter(post => post.postType === 'Comment');

    const response = await supertest(app).get('/user/feed/user1?postType=Comment');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResult);
  });

  it('should return the feed for a user with the follow filter provided', async () => {
    mockingoose(UserModel).toReturn(feedUser, 'findOne');
    mockingoose(FollowModel).toReturn(FOLLOWS, 'find');

    const expectedResult = FULL_FEED.filter(post => post.postType === 'Follow');

    const response = await supertest(app).get('/user/feed/user1?postType=Follow');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResult);
  });

  it('should return an error if the user does not exist', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const response = await supertest(app).get('/user/feed/fakeUser');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching user feed');
  });

  it('should return an error if there is an issue fetching the feed', async () => {
    mockingoose(UserModel).toReturn(feedUser, 'findOne');
    mockingoose(FollowModel).toReturn(FOLLOWS, 'find');
    mockingoose(QuestionModel).toReturn([populatedQuestion1], 'find');
    mockingoose(AnswerModel).toReturn([populatedAnswer1], 'find');
    mockingoose(CommentModel).toReturn([populatedComment1], 'find');

    jest.spyOn(util, 'getFeedForUser').mockRejectedValueOnce(new Error('Error fetching feed'));

    const response = await supertest(app).get('/user/feed/user1');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching user feed');
  });
});

describe('GET /follow/recommendations/:username', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Ensure connection is properly closed
  });

  it('should return the recommendations for a user', async () => {
    jest.spyOn(util, 'getFollowRecommendationsForUser').mockResolvedValueOnce([USER2]);
    const expectedResult = { ...USER2, createdAt: USER2.createdAt.toISOString() };

    const response = await supertest(app).get('/user/follow/recommendations/user1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([expectedResult]);
  });

  it('should return an error when the user is invalid', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const response = await supertest(app).get('/user/follow/recommendations/invalidUser');

    expect(response.status).toBe(500);
  });
});
