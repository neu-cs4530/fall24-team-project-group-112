import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Notification, NotificationType } from '../types';

describe('POST /seen/:username', () => {
  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  const username = 'receiver1';
  const notifications: Notification[] = [
    {
      _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
      notificationType: NotificationType.ANSWER,
      eventId: new ObjectId('73e9b58910afe6e94fc6e6de'),
      receiverUsername: username,
      notificationDate: new Date('2023-11-19T09:24:00'),
      seen: false,
    },
    {
      _id: new ObjectId('91e9b58910afe6e94fc6e6de'),
      notificationType: NotificationType.ANSWER,
      eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
      receiverUsername: username,
      notificationDate: new Date('2023-11-19T09:24:00'),
      seen: false,
    },
    {
      _id: new ObjectId('91e9b58910afe6e94fc6e6de'),
      notificationType: NotificationType.ANSWER,
      eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
      receiverUsername: 'receiver2',
      notificationDate: new Date('2023-11-19T09:24:00'),
      seen: false,
    },
  ];

  test('markNotificationsAsSeen should update the notifications of the specified user', async () => {
    const expectedResults = notifications
      .filter(notif => notif.receiverUsername === 'receiver1')
      .map(result => ({ ...result, seen: true }));

    jest.spyOn(util, 'markNotificationsAsSeen').mockResolvedValueOnce(expectedResults);

    const result = await supertest(app).patch(`/notification/seen/${username}`);

    expect(result.status).toBe(200);
    expect(result.body[0].seen).toBe(true);
    expect(result.body[1].seen).toBe(true);
    expect(result.body[0].receiverUsername).toBe('receiver1');
    expect(result.body[1].receiverUsername).toBe('receiver1');
  });
  test('markNotificationsAsSeen should return an error if there is an error updating the notifications', async () => {
    jest
      .spyOn(util, 'markNotificationsAsSeen')
      .mockResolvedValueOnce({ error: 'Error performing update' });

    const result = await supertest(app).patch(`/notification/seen/${username}`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual(
      'Error when marking notifications as seen: Error performing update',
    );
  });

  test('markNotificationsAsSeen should return an error if no username is provided', async () => {
    const result = await supertest(app).patch(`/notification/seen/${undefined}`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual(
      'Error when marking notifications as seen: Error when marking notifications as seen: Invalid username',
    );
  });

  test('markNotificationsAsSeen should return an error if an invalid username is provided', async () => {
    const result = await supertest(app).patch(`/notification/seen/invalidUser`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual(
      'Error when marking notifications as seen: Error when marking notifications as seen: Invalid username',
    );
  });
});

describe('GET /get/:username', () => {
  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  const username = 'receiver1';
  const notifications: Notification[] = [
    {
      _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
      notificationType: NotificationType.ANSWER,
      eventId: new ObjectId('73e9b58910afe6e94fc6e6de'),
      receiverUsername: 'receiver3',
      notificationDate: new Date('2023-11-19T09:24:00'),
      seen: false,
    },

    {
      _id: new ObjectId('91e9b58910afe6e94fc6e6de'),
      notificationType: NotificationType.BADGE,
      eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
      receiverUsername: 'receiver3',
      notificationDate: new Date('2023-11-19T09:24:00'),
      seen: false,
    },

    {
      _id: new ObjectId('91e9b58910afe6e94fc6e6de'),
      notificationType: NotificationType.FOLLOW,
      eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
      receiverUsername: 'receiver3',
      notificationDate: new Date('2023-11-19T09:24:00'),
      seen: false,
    },

    {
      _id: new ObjectId('91e9c58910afe6e94fc6e6de'),
      notificationType: NotificationType.COMMENT,
      eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
      receiverUsername: 'receiver3',
      notificationDate: new Date('2023-11-19T09:24:00'),
      seen: false,
    },
  ];

  test('getNotifications should get all the notifications for the specified user', async () => {
    const expectedResults = notifications.filter(notif => notif.receiverUsername === 'receiver3');

    jest.spyOn(util, 'getNotificationsForUser').mockResolvedValueOnce(expectedResults);

    const result = await supertest(app).get(`/notification/get/receiver3`);

    expect(result.status).toBe(200);
    expect(result.body[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6de');
    expect(result.body[1]._id?.toString()).toEqual('91e9b58910afe6e94fc6e6de');
    expect(result.body[2]._id?.toString()).toEqual('91e9b58910afe6e94fc6e6de');
    expect(result.body[3]._id?.toString()).toEqual('91e9c58910afe6e94fc6e6de');
  });

  test('getNotifications should return an empty list if no notifications exist for the user', async () => {
    jest.spyOn(util, 'getNotificationsForUser').mockResolvedValueOnce([]);

    const result = await supertest(app).get(`/notification/get/${username}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual([]);
  });

  test('getNotifications should return an error if there is an error getting the notifications', async () => {
    jest
      .spyOn(util, 'getNotificationsForUser')
      .mockResolvedValueOnce({ error: 'Error getting notifications' });

    const result = await supertest(app).get(`/notification/get/${username}`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual('Error when getting notifications: Error getting notifications');
  });

  test('getNotifications should return an error if no username is provided', async () => {
    const result = await supertest(app).get(`/notification/get/${undefined}`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual(
      '"Error when getting notifications: Error when getting notifications: Invalid username',
    );
  });

  test('getNotifications should return an error if an invalid username is provided', async () => {
    const result = await supertest(app).get(`/notification/get/invalidUser`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual(
      'Error when getting notifications: Error when getting notifications: Invalid username',
    );
  });

  test('getNotifications should return an error if getNotificationsForUser throws an error', async () => {
    jest
      .spyOn(util, 'getNotificationsForUser')
      .mockResolvedValueOnce({ error: 'getNotificationsForUser threw an error' });
    const result = await supertest(app).get(`/notification/get/receiver3`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual(
      '"Error when getting notifications: getNotificationsForUser threw an error',
    );
  });
});
