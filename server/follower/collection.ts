import type {HydratedDocument, Schema, Types} from 'mongoose';
import type {follower} from './model';
import followerModel from './model';
import UserCollection from '../user/collection';

/**
 * This file contains a class with functionality to interact with Following stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class followerCollection {
  /**
   * Add a new follower
   *
   * @param {string} userId - The userId of the user
   * @param {string} followsUsername - The username of the user they follow
   * @return {Promise<HydratedDocument<follower>>} - The newly created followerFollowing
   */
     static async addOne(username: string, followersUserId:Types.ObjectId | string): Promise<HydratedDocument<follower>> {
      console.log(followersUserId);
      const user = await UserCollection.findOneByUsername(username);
      const follower = new followerModel({userId:user._id, followersUserId:followersUserId});
      await follower.save(); // Saves user to MongoDB
      return follower;
    }


  /**
   * Delete a follower from the collection.
   *
   * @param {string} userId - The userId of follower user 
   * @param {string} followersUserId - The userId of user's follower 
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, followersUserId: Types.ObjectId | string): Promise<boolean> {
    const user = await followerModel.deleteOne({userId: userId, followersUserId: followersUserId});
    return user !== null;
  }

  /**
   * Delete all the followers containing the given user
   *
   * @param {string} userId - The id of user 
   */
     static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
      await followerModel.deleteMany({userId:userId});
      await followerModel.deleteMany({followersUserId: userId});
  }

  /**
   * Get all the userId's followers in the database
   *
   * @param {string} username - The username of follower user 
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
     static async findAllFollowersOfUsername(username: string): Promise<Array<HydratedDocument<follower>>> {
      // Retrieves followers and sorts them alphabetically?
      // console.log(userId);
      // console.log("eeep");
      const user = await UserCollection.findOneByUsername(username);
      return followerModel.find({userId: user._id}).sort({}).populate('userId');
    }


    /**
   * Get all the userId's following in the database
   *
   * @param {string} username - The username of follower user 
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
       static async findAllFollowing(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<follower>>> {
        // Retrieves followers and sorts them alphabetically?
        // console.log(userId);
        // console.log("eeep");
        return followerModel.find({followersUserId: userId}).sort({}).populate('userId');
      }



    /**
   * Get one of the userId's followers in the database
   *
   * @param {string} userId - The userId of follower user 
   * @param {string} followersUserId - The userId of the user they follow
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
       static async findOneFollowerOfUserId(userId: Types.ObjectId | string, followersUserId: Types.ObjectId | string): Promise<Array<HydratedDocument<follower>>> {
        // Retrieves followers and sorts them _____?
        // console.log(userId);
        // console.log("eeep");
        return followerModel.find({userId: userId, followersUserId: followersUserId}).sort({}).populate('userId');
      }

    /**
   * Get all the followers in the database
   *
   * @return {Promise<HydratedDocument<follower>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<follower>>> {
    // Retrieves followers and sorts them ______
    return followerModel.find({}).sort({}).populate('userId');
  }
}

export default followerCollection;
