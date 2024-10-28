import { Schema } from 'mongoose';
import { NotificationType } from '../../types';
/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure for storing notifications in the database.
 * Each notification includes the following fields:
 *
 * - _id: The unique identifier for the notification. This field is optional.
 * - notificationType: The type of notification, one of NotificationType. This field is required.
 * - eventId: The unique identifier of the event that triggered the notification. This field is required.
 * - receiverUsername: The username of the user who will receive the notification. This field is required.
 * - notificationDate: The date and time when the notification was created. This field is required.
 * - seen: A boolean value indicating whether the notification has been seen by the user. This field is required and defaults to false.
 */
const notificationSchema: Schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
  },
  notificationType: {
    type: String,
    enum: NotificationType,
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  receiverUsername: {
    type: String,
    required: true,
  },
  notificationDate: {
    type: Date,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
    required: true,
  },
});

export default notificationSchema;
