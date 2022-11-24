import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {bestFreet} from './model';
import type {Freet, PopulatedFreet} from '../freet/model';
import FreetCollection from '../freet/collection';
import * as freetUtil from '../freet/util';

// Update this if you add a property to the User type!
type BestFreetResponse = {
  userId: string;
  freet: freetUtil.FreetResponse;
  dateUsed: string;
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
const constructBestFreetResponse = async (BestFreet: HydratedDocument<bestFreet>): Promise<BestFreetResponse> => {
  const bestFreetCopy: bestFreet = {
    ...BestFreet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    userId: bestFreetCopy.userId.toString(),
    freet: freetUtil.constructFreetResponse(await FreetCollection.findOne(bestFreetCopy.freetId)),
    dateUsed: formatDate(bestFreetCopy.dateUsed)
  };
};

export {
  constructBestFreetResponse
};
