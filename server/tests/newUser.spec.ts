import mongoose from 'mongoose';
import supertest from 'supertest';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../app';
import * as util from '../models/application';
import FollowModel from '../models/follows';

const addUserSpy = jest.spyOn(util, 'addUser');
const isUsernameUniqueSpy = jest.spyOn(util, 'isUsernameUnique');

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));
const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.Mock;
const validId = new mongoose.Types.ObjectId();
const mockReqBody = {
  user: {
    username: 'dummyUser',
    firstName: 'Dummy',
    lastName: 'User',
    email: 'dummyUser@email.com',
    createdAt: new Date('2024-06-03'),
  },
  password: '123456',
};

const mockUser = {
  _id: validId,
  username: 'dummyUser',
  firstName: 'Dummy',
  lastName: 'User',
  email: 'dummyUser@email.com',
  badges: [],
  createdAt: new Date('2024-06-03'),
};

const mockUserCreated = {
  _id: validId.toString(),
  username: 'dummyUser',
  firstName: 'Dummy',
  lastName: 'User',
  email: 'dummyUser@email.com',
  badges: [],
  createdAt: new Date('2024-06-03').toISOString(),
};

describe('POST /user', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new user to the database', async () => {
    addUserSpy.mockResolvedValueOnce(mockUser);
    isUsernameUniqueSpy.mockResolvedValueOnce(true);
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: '12345' } });

    const response = await supertest(app).post('/user').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserCreated);
    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      undefined,
      mockReqBody.user.email,
      mockReqBody.password,
    );
  });

  it('should return an error if the request is missing a user object', async () => {
    const mockReqBodyError = {
      password: '123456',
    };

    const response = await supertest(app).post('/user').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return an error if the request is missing a password', async () => {
    const mockReqBodyError = {
      user: {
        username: 'dummyUser',
        firstName: 'Dummy',
        lastName: 'User',
        email: 'dummyUser@email.com',
        createdAt: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/user').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return an error if the request is empty', async () => {
    const mockReqBodyError = {};

    const response = await supertest(app).post('/user').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return an error if the user is missing a username', async () => {
    const mockReqBodyError = {
      user: {
        firstName: 'Dummy',
        lastName: 'User',
        email: 'dummyUser@email.com',
        createdAt: new Date('2024-06-03'),
      },
      password: '123456',
    };

    const response = await supertest(app).post('/user').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user');
  });

  it('should return an error if the user is missing a first name', async () => {
    const mockReqBodyError = {
      user: {
        username: 'dummyUser',
        lastName: 'User',
        email: 'dummyUser@email.com',
        createdAt: new Date('2024-06-03'),
      },
      password: '123456',
    };

    const response = await supertest(app).post('/user').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user');
  });

  it('should return an error if the user is missing a last name', async () => {
    const mockReqBodyError = {
      user: {
        username: 'dummyUser',
        firstName: 'Dummy',
        email: 'dummyUser@email.com',
        createdAt: new Date('2024-06-03'),
      },
      password: '123456',
    };

    const response = await supertest(app).post('/user').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user');
  });

  it('should return an error if the user is missing an email', async () => {
    const mockReqBodyError = {
      user: {
        username: 'dummyUser',
        firstName: 'Dummy',
        lastName: 'User',
        createdAt: new Date('2024-06-03'),
      },
      password: '123456',
    };

    const response = await supertest(app).post('/user').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user');
  });

  it('should return an error if the user is missing a created at date', async () => {
    const mockReqBodyError = {
      user: {
        username: 'dummyUser',
        firstName: 'Dummy',
        lastName: 'User',
        email: 'dummyUser@email.com',
      },
      password: '123456',
    };

    const response = await supertest(app).post('/user').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user');
  });

  it('should return an error if the user has an invalid email', async () => {
    const mockReqBodyError = {
      user: {
        username: 'dummyUser',
        firstName: 'Dummy',
        lastName: 'User',
        email: 'invalidEmail',
        createdAt: new Date('2024-06-03'),
      },
      password: '123456',
    };

    const response = await supertest(app).post('/user').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user');
  });

  it('should return an error if username is already in use', async () => {
    isUsernameUniqueSpy.mockResolvedValueOnce(false);
    const response = await supertest(app).post('/user').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Username already exists, choose a unique username');
  });

  it('should return database error in response if addUser method throws an error', async () => {
    addUserSpy.mockResolvedValueOnce({ error: 'Error when creating a user' });
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({});
    isUsernameUniqueSpy.mockResolvedValueOnce(true);
    const response = await supertest(app).post('/user').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if createUserWithEmailAndPassword method throws an error', async () => {
    addUserSpy.mockResolvedValueOnce(mockUser);
    isUsernameUniqueSpy.mockResolvedValueOnce(true);
    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error('Error when creating a firebase user'),
    );
    const response = await supertest(app).post('/user').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  describe('GET /follow/:username', () => {
    afterEach(async () => {
      jest.clearAllMocks();
    });

    afterAll(async () => {
      await mongoose.connection.close();
      await mongoose.disconnect();
    });

    it('should return a server error if there is an issue fetching followers and following', async () => {
      const mockReqParams = { username: 'johnDoe' };

      jest.spyOn(util, 'isUsernameUnique').mockResolvedValue(true);

      jest.spyOn(FollowModel, 'find').mockImplementation(() => {
        throw new Error('Database error');
      });

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
        followers: ['follower1', 'follower2'],
        following: ['following1', 'following2'],
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
});
