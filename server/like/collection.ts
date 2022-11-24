import type {HydratedDocument, Schema, Types} from 'mongoose';
import FreetModel from '../freet/model';
import UserCollection from '../user/collection';
import type {like} from './model';
import likeModel from './model';

/**
 * This file contains a class with functionality to interact with Following stored
kalsjdklajdklsajdklsajlkdjaskldjasd * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a new like
   *
   * @param {string} freetId - The freetId of the freet
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<like>>} - The newly created like
   */
     static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<like>> {
      const like = new likeModel({freetId, userId});
      const freet = await FreetModel.findOne({_id: freetId});
      // console.log(freet. )
      freet.likes=  freet.likes == NaN?  1: freet.likes+1;
      await freet.save();
      await like.save(); // Saves user to MongoDB
      return like;
    }


  /**
   * Delete a like from the collection. Unlike
   *
   * @param {string} freetId - The userId of follower user 
   * @param {string} userId - The userId of user follower user follows
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const like = await likeModel.deleteOne({freetId: freetId, userId: userId});
    const freet = await FreetModel.findOne({_id: freetId});
    freet.likes -= 1;
    await freet.save();
    return like !== null;
  }

  /**
   * Delete all the likes by the given user
   *
   * @param {string} userId - The id of user 
   */
     static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
      await likeModel.deleteMany({userId:userId});
    }

      /**
   * Get all the userId's likes in the database
   *
   * @param {string} userId - The userId of the user 
   * @param {string} freetId - The freetId of the freet 
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
       static async findOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string ): Promise<Array<HydratedDocument<like>>> {
        // Retrieves followers and sorts them alphabetically?
        // console.log(userId);
        // console.log("eeep");
        return likeModel.find({userId: userId,freetId: freetId}).sort({}).populate('userId');
        //this returns the likeModel objects (should i return the freets themselves)
    }

  /**
   * Get all the userId's likes in the database
   *
   * @param {string} userId - The userId of the user 
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
     static async findAllLikesOfUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<like>>> {
      // Retrieves followers and sorts them alphabetically?
      // console.log(userId);
      // console.log("eeep");
      return likeModel.find({userId: userId}).sort({}).populate('userId');
      //this returns the likeModel objects (should i return the freets themselves)
    }

  
    /**
     * Get all the userId's likes in the database
     *
     * @param {string} userId - The userId of the user 
     * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
     */
       static async findAllLikesOfFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<like>>> {
        // Retrieves followers and sorts them alphabetically?
        // console.log(userId);
        // console.log("eeep");
        return likeModel.find({freetId: freetId}).sort({}).populate('userId');
        //this returns the likeModel objects (should i return the freets themselves)
      }


    /**
     * Get all the username user's likes in the database
     *
     * @param {string} username - The username of the user 
     * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
     */
     static async findAllLikesOfUsername(username: string): Promise<Array<HydratedDocument<like>>> {
      // Retrieves followers and sorts them alphabetically?
      // console.log(userId);
      // console.log("eeep");
      const author = await UserCollection.findOneByUsername(username);
      return likeModel.find({userId: author._id}).sort({}).populate('userId');
      //this returns the likeModel objects (should i return the freets themselves)
    }

}

export default LikeCollection;
