import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Notification, NotificationType } from '../types';

describe('POST /seen/:username', () => {
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
