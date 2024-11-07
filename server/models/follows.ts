import mongoose, { Model } from 'mongoose';
import followSchema from './schema/follow';
import { Follow } from '../types';

/**
 * Mongoose model for the `Follow` collection.
 *
 * This model is created using the `Follow` interface and the `followSchema`, representing the
 * `Follow` collection in the MongoDB database, and provides an interface for interacting with
 * the stored follows.
 *
 * @type {Model<Follow>}
 */
const FollowModel: Model<Follow> = mongoose.model<Follow>('Follow', followSchema);

export default FollowModel;
