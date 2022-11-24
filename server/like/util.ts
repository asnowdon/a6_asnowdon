import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {like} from './model';
import {Types} from 'mongoose';


import UserCollection from '../user/collection';

// Update this if you add a property to the User type!
type LikeResponse = {
  userId: Types.ObjectId;
  username: string;
  freetId: Types.ObjectId;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructLikeResponse = async (like: HydratedDocument<like>): Promise<LikeResponse> => {
  const likeCopy: like = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const user = await UserCollection.findOneByUserId(likeCopy.userId);
  return {
    ...likeCopy,
    username: user.username
  };
};

export {
  constructLikeResponse
};
