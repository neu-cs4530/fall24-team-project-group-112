import mongoose, { Model } from 'mongoose';
import notificationSchema from './schema/notification';
import { Notification } from '../types';

/**
 * Mongoose model for the `Notification` collection.
 *
 * This model is created using the `Notification` interface and the `notificationSchema`.
 * It represents the `Notification` collection in the database, and provides an interface to
 * interact with notifications.
 *
 * @type {Model<Notification>}
 */
const NotificationModel: Model<Notification> = mongoose.model<Notification>(
  'Notification',
  notificationSchema,
);

export default NotificationModel;
