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
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  { collection: 'Badge' },
);

export default badgeSchema;
