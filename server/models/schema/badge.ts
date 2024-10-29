import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Badge collection.
 *
 * This schema defines the structure for storing badges in the database.
 * Each badge includes the following fields:
 * - `name`: The name of the badge.
 * - `description`: The description of the badge.
 * - `color`: The color of the badge.
 */
const badgeSchema: Schema = new Schema(
  {
    badgeName: {
      type: String,
      enum: badgeName,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  { collection: 'Badge' },
);

export default badgeSchema;
