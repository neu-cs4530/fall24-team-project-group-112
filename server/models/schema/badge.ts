import { Schema } from 'mongoose';
import { BadgeName, BadgeColor } from '../../types';

/**
 * Mongoose schema for the Badge collection.
 *
 * This schema defines the structure for storing badges in the database.
 * Each badge includes the following fields:
 * - `badgeName`: The name of the badge, one of BadgeName. This field is required.
 * - `description`: The description of the badge. This field is required.
 * - `color`: The color of the badge, one of BadgeColor. This field is required.
 */
const badgeSchema: Schema = new Schema(
  {
    badgeName: {
      type: String,
      enum: BadgeName,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      enum: BadgeColor,
      required: true,
    },
  },
  { collection: 'Badge' },
);

export default badgeSchema;
