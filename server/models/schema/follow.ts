import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Follow collection.
 *
 * This schema defines the structure for storing follows in the database.
 * Each follow includes the following fields:
 * - `followerId`: The id of the user who followed another user.
 * - `followeeId`: The id of the user who was followed by another user.
 * - `followDateTime`: The date and time when the follow was issued.
 */
const followSchema: Schema = new Schema(
  {
    followerUsername: {
      type: String,
      required: true,
    },
    followeeUsername: {
      type: String,
    },
    followDateTime: {
      type: Date,
    },
  },
  { collection: 'Follow' },
);

export default followSchema;
