import {SchemaType, Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import UserModel from '../user/model';


/**
 * This file defines the properties stored in a followerFollowing
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for follower on the backend
export type like = {
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const likeSchema = new Schema({
  // The user's id
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // The user id of the account they follow
  freetId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const likeModel = model<like>('like', likeSchema);
export default likeModel;

// const UserModel = model<User>('User', UserSchema);
// export default UserModel;
