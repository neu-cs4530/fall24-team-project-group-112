import mongoose from 'mongoose';
import supertest from 'supertest';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../app';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));
const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.Mock;

describe('GET /login', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should login a user via firebase and get their email', async () => {
    const mockReqBody = {
      email: 'testuser@email.com',
      password: '123456',
    };

    mockSignInWithEmailAndPassword.mockResolvedValueOnce('testuser@email.com');

    const response = await supertest(app).get('/user/login').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReqBody.email);
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      undefined,
      mockReqBody.email,
      mockReqBody.password,
    );
  });

  it('should return an error if the request is empty', async () => {
    const mockReqBodyError = {};

    const response = await supertest(app).get('/user/login').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return an error if the email is missing', async () => {
    const mockReqBodyError = {
      password: '123456',
    };

    const response = await supertest(app).get('/user/login').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return an error if the password is missing', async () => {
    const mockReqBodyError = {
      email: 'testemail@email.com',
    };

    const response = await supertest(app).get('/user/login').send(mockReqBodyError);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return an error if the login credentials are incorrect', async () => {
    const mockReqBodyError = {
      email: 'testuser@wrong.com',
      password: 'wrongpassword',
    };

    mockSignInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid email or password'));

    const response = await supertest(app).get('/user/login').send(mockReqBodyError);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Login error: Invalid email or password');
  });
});
