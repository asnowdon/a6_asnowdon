import {SchemaType, Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import UserModel from '../user/model';


/**
 * This file defines the properties stored in a followerFollowing
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for follower on the backend
export type description = {
  userId: Types.ObjectId;
  content: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const descriptionSchema = new Schema({
  // The user's id
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // The user id of the account they follow
  content: {
    type: String,
    required: true
  }
});

const descriptionModel = model<description>('description', descriptionSchema);
export default descriptionModel;

