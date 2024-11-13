import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Follow collection.
 *
 * This schema defines the structure for storing follows in the database.
 * Each follow includes the following fields:
 * - `followerUsername`: The username of the user who followed another user.
 * - `followeeUsername`: The username of the user who was followed by another user.
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
      required: true,
    },
    followDateTime: {
      type: Date,
      required: true,
    },
  },
  { collection: 'Follow', toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

followSchema.virtual('follower', {
  ref: 'User',
  localField: 'followerUsername',
  foreignField: 'username',
  justOne: true,
});

followSchema.virtual('followee', {
  ref: 'User',
  localField: 'followeeUsername',
  foreignField: 'username',
  justOne: true,
});

export default followSchema;
