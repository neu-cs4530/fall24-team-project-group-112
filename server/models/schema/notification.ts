import { Schema } from 'mongoose';
import { NotificationType } from '../../types';
/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure for storing notifications in the database.
 * Each notification includes the following fields:
 *
 * - notificationType: The type of notification, one of NotificationType. This field is required.
 * - eventId: The unique identifier of the event that triggered the notification. This field is required.
 * - question: The unique identifier of the question associated with the notification. This field is optional but provided if the notification type is 'Answer' or 'Comment'.
 * - answer: The unique identifier of the answer associated with the notification. This field is optional but provided if the notification type is 'Comment' and the comment is on an Answer.
 * - receiverUsername: The username of the user who will receive the notification. This field is required.
 * - notificationDate: The date and time when the notification was created. This field is required.
 * - seen: A boolean value indicating whether the notification has been seen by the user. This field is required and defaults to false.
 */
const notificationSchema: Schema = new Schema(
  {
    notificationType: {
      type: String,
      enum: NotificationType,
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'notificationType',
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    },
    answer: {
      type: Schema.Types.ObjectId,
      ref: 'Answer',
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
  },
  { collection: 'Notification', toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

notificationSchema.virtual('user', {
  ref: 'User',
  localField: 'receiverUsername',
  foreignField: 'username',
  justOne: true,
});

export default notificationSchema;
