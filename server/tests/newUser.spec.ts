import mongoose from 'mongoose';
import supertest from 'supertest';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../app';
import * as util from '../models/application';
import FollowModel from '../models/follows';
import UserModel from '../models/users';

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
});
