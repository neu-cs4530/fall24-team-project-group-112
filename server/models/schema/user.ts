import { Schema } from 'mongoose';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each user includes the following fields:
 * - `username`: The unique identifier of the user. This field is required.
 * - `firstName`: The user's first name. This field is required.
 * - `lastName`: The user's last name. This field is required.
 * - `email`: The user's email address. This field is required.
 * - `headline`: The user's one-liner headline. Optional field.
 * - `bio`: The user's full bio. Optional field.
 * - `githubURL`: The user's GitHub profile to be shown on their FSO profile. Optional field.
 * - `company`: The company a user currently works at. Optional field.
 * - `school`: The school a user currently attends. Optional field.
 * - `city`: The city a user lives in. Optional field.
 * - `state`: The state a user lives in. Optional field.
 * - `badges`: The list of badges a user has earned. This field is required but defaults to an empty array.
 * - `avatarName`: The name of the user's avatar image. Optional field.
 * - `createdAt`: The date the user created their account. This field is required.
 */
const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    headline: { type: String },
    bio: { type: String },
    githubUrl: { type: String },
    company: { type: String },
    school: { type: String },
    city: { type: String },
    state: { type: String },
    badges: { type: [{ type: String }], default: [], required: true },
    avatarName: {
      type: String,
      enum: ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5'],
    },
    createdAt: { type: Date, required: true },
  },
  { collection: 'User' },
);

export default userSchema;
