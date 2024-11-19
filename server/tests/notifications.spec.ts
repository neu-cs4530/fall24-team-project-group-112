import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Notification, NotificationType } from '../types';

const USERNAME = 'receiver1';
const NOTIFICATIONS: Notification[] = [
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
  {
    _id: new ObjectId('91e9c58910afe6e94fc6e6de'),
    notificationType: NotificationType.BADGE,
    eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
    receiverUsername: 'receiver1',
    notificationDate: new Date('2023-11-19T09:24:00'),
    seen: false,
  },
  {
    _id: new ObjectId('72e9c58910afe6e94fc6e6ab'),
    notificationType: NotificationType.ANSWER,
    eventId: new ObjectId('75e9b58910afe6e94fc6e6de'),
    receiverUsername: 'receiver1',
    notificationDate: new Date('2023-11-19T09:24:00'),
    seen: false,
  },
];
describe('PATCH /seen/:username', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  test('markNotificationsAsSeen should update the notifications of the specified user', async () => {
    const expectedResults = NOTIFICATIONS.filter(
      notif => notif.receiverUsername === 'receiver1',
    ).map(result => ({ ...result, seen: true }));

    jest.spyOn(util, 'markNotificationsAsSeen').mockResolvedValueOnce(expectedResults);

    const result = await supertest(app).patch(`/notification/seen/${USERNAME}`);

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

    const result = await supertest(app).patch(`/notification/seen/${USERNAME}`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual(
      'Error when marking notifications as seen: Error performing update',
    );
  });

  test('markNotificationsAsSeen should return an error if no username is provided', async () => {
    jest
      .spyOn(util, 'markNotificationsAsSeen')
      .mockResolvedValueOnce({ error: 'Invalid username' });

    const result = await supertest(app).patch(`/notification/seen/${undefined}`);
    expect(result.status).toBe(500);
    expect(result.text).toContain('Invalid username');
  });

  test('markNotificationsAsSeen should return an error if an invalid username is provided', async () => {
    jest
      .spyOn(util, 'markNotificationsAsSeen')
      .mockResolvedValueOnce({ error: 'Invalid username' });

    const result = await supertest(app).patch(`/notification/seen/invalidUser`);
    expect(result.status).toBe(500);
    expect(result.text).toContain('Invalid username');
  });
});

describe('DELETE /:username', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  test('deleteNotificationsForUser should delete the notifications of the specified user', async () => {
    jest
      .spyOn(util, 'deleteNotificationsForUser')
      .mockResolvedValueOnce({ success: 'Notifications deleted' });

    const result = await supertest(app).delete(`/notification/${USERNAME}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: 'Notifications deleted' });
  });
  test('deleteNotificationsForUser should delete the specified notification for the specified user', async () => {
    jest
      .spyOn(util, 'deleteNotificationsForUser')
      .mockResolvedValueOnce({ success: 'Notifications deleted' });

    const result = await supertest(app).delete(
      `/notification/${USERNAME}/91e9c58910afe6e94fc6e6de`,
    );

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: 'Notifications deleted' });
  });
  test('deleteNotificationsForUser should return an error if there is an error updating the notifications', async () => {
    jest
      .spyOn(util, 'deleteNotificationsForUser')
      .mockResolvedValueOnce({ error: 'Error when deleting notifications' });

    const result = await supertest(app).delete(`/notification/${USERNAME}`);
    expect(result.status).toBe(500);
    expect(result.text).toContain('Error when deleting notifications');
  });

  test('deleteNotificationsForUser should return an error if no username is provided', async () => {
    jest
      .spyOn(util, 'deleteNotificationsForUser')
      .mockResolvedValueOnce({ error: 'Error when deleting notifications' });

    const result = await supertest(app).delete(`/notification/${undefined}`);
    expect(result.status).toBe(500);
    expect(result.text).toContain('Error when deleting notifications');
  });

  test('deleteNotificationsForUser should return an error if an invalid username is provided', async () => {
    jest
      .spyOn(util, 'deleteNotificationsForUser')
      .mockResolvedValueOnce({ error: 'Error when deleting notifications: Invalid username' });

    const result = await supertest(app).delete(`/notification/invalidUsername`);
    expect(result.status).toBe(500);
    expect(result.text).toContain('Invalid username');
  });

  test('deleteNotificationsForUser should return an error if an invalid notificationId is provided', async () => {
    jest
      .spyOn(util, 'deleteNotificationsForUser')
      .mockResolvedValueOnce({ error: 'Error when deleting notifications' });

    const result = await supertest(app).delete(
      `/notification/${USERNAME}/91f9c58910afe6e94fc6e6de`,
    );
    expect(result.status).toBe(500);
    expect(result.text).toContain('Error when deleting notifications');
  });

  test('deleteNotificationsForUser should return an error if the notificationId does not belong to the specified user', async () => {
    jest
      .spyOn(util, 'deleteNotificationsForUser')
      .mockResolvedValueOnce({ error: 'Error when deleting notifications' });

    const result = await supertest(app).delete(
      `/notification/${USERNAME}/65e9b58910afe6e94fc6e6de`,
    );
    expect(result.status).toBe(500);
    expect(result.text).toContain('Error when deleting notifications');
  });
});

describe('GET /:username', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  test('getNotifications should get all the notifications for the specified user when no filter is provided', async () => {
    const expectedResults = NOTIFICATIONS.filter(notif => notif.receiverUsername === 'receiver3');

    jest.spyOn(util, 'getNotificationsForUser').mockResolvedValueOnce(expectedResults);

    const result = await supertest(app).get(`/notification/receiver3`);

    expect(result.status).toBe(200);
    expect(result.body[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6de');
    expect(result.body[1]._id?.toString()).toEqual('91e9b58910afe6e94fc6e6de');
    expect(result.body[2]._id?.toString()).toEqual('91e9b58910afe6e94fc6e6de');
    expect(result.body[3]._id?.toString()).toEqual('91e9c58910afe6e94fc6e6de');
  });

  test('getNotifications should get only Comment notifications for the specified user when the Comment filter is provided', async () => {
    const expectedResults = NOTIFICATIONS.filter(
      notif =>
        notif.receiverUsername === 'receiver3' &&
        notif.notificationType === NotificationType.COMMENT,
    );

    jest.spyOn(util, 'getNotificationsForUser').mockResolvedValueOnce(expectedResults);

    const result = await supertest(app).get(`/notification/receiver3?type=Comment`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBe(1);
    expect(result.body[0].receiverUsername).toEqual('receiver3');
    expect(result.body[0].notificationType).toEqual(NotificationType.COMMENT);
  });

  test('getNotifications should get only Answer notifications for the specified user when the Answer filter is provided', async () => {
    const expectedResults = NOTIFICATIONS.filter(
      notif =>
        notif.receiverUsername === 'receiver3' &&
        notif.notificationType === NotificationType.ANSWER,
    );

    jest.spyOn(util, 'getNotificationsForUser').mockResolvedValueOnce(expectedResults);

    const result = await supertest(app).get(`/notification/receiver3?type=Answer`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBe(1);
    expect(result.body[0].receiverUsername).toEqual('receiver3');
    expect(result.body[0].notificationType).toEqual(NotificationType.ANSWER);
  });

  test('getNotifications should get only Badge notifications for the specified user when the Badge filter is provided', async () => {
    const expectedResults = NOTIFICATIONS.filter(
      notif =>
        notif.receiverUsername === 'receiver3' && notif.notificationType === NotificationType.BADGE,
    );

    jest.spyOn(util, 'getNotificationsForUser').mockResolvedValueOnce(expectedResults);

    const result = await supertest(app).get(`/notification/receiver3?type=Badge`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBe(1);
    expect(result.body[0].receiverUsername).toEqual('receiver3');
    expect(result.body[0].notificationType).toEqual(NotificationType.BADGE);
  });

  test('getNotifications should get only Follow notifications for the specified user when the Follow filter is provided', async () => {
    const expectedResults = NOTIFICATIONS.filter(
      notif =>
        notif.receiverUsername === 'receiver3' &&
        notif.notificationType === NotificationType.FOLLOW,
    );

    jest.spyOn(util, 'getNotificationsForUser').mockResolvedValueOnce(expectedResults);

    const result = await supertest(app).get(`/notification/receiver3?type=Follow`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBe(1);
    expect(result.body[0].receiverUsername).toEqual('receiver3');
    expect(result.body[0].notificationType).toEqual(NotificationType.FOLLOW);
  });

  test('getNotifications should return an empty list if no notifications exist for the user', async () => {
    jest.spyOn(util, 'getNotificationsForUser').mockResolvedValueOnce([]);

    const result = await supertest(app).get(`/notification/${USERNAME}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual([]);
  });

  test('getNotifications should return an error if there is an error getting the notifications', async () => {
    jest
      .spyOn(util, 'getNotificationsForUser')
      .mockResolvedValueOnce({ error: 'Error getting notifications' });

    const result = await supertest(app).get(`/notification/${USERNAME}`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual('Error when getting notifications: Error getting notifications');
  });

  test('getNotifications should return an error if no username is provided', async () => {
    jest
      .spyOn(util, 'getNotificationsForUser')
      .mockResolvedValueOnce({ error: 'Error getting user' });
    const result = await supertest(app).get(`/notification/${undefined}`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual('Error when getting notifications: Error getting user');
  });

  test('getNotifications should return an error if an invalid username is provided', async () => {
    jest
      .spyOn(util, 'getNotificationsForUser')
      .mockResolvedValueOnce({ error: 'Invalid username' });
    const result = await supertest(app).get(`/notification/invalidUser`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual('Error when getting notifications: Invalid username');
  });

  test('getNotifications should return an error if getNotificationsForUser throws an error', async () => {
    jest
      .spyOn(util, 'getNotificationsForUser')
      .mockResolvedValueOnce({ error: 'getNotificationsForUser threw an error' });
    const result = await supertest(app).get(`/notification/receiver3`);
    expect(result.status).toBe(500);
    expect(result.text).toEqual(
      'Error when getting notifications: getNotificationsForUser threw an error',
    );
  });
});
