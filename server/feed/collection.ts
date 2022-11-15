import type {HydratedDocument, Types} from 'mongoose';
import type {Feed} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import FeedModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FeedCollection {
  /**
   * Add a Feed to the collection
   *
   * @param {string} userId - The id of the user
   * @param {string} freetId - The id of the post
   * @return {Promise<HydratedDocument<Feed>>} - The newly created feed
   */
  static async addOne(userId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<HydratedDocument<Feed>> {
    const feed = new FeedModel({
      userId,
      postId
    });
    await feed.save(); // Saves feed to MongoDB
    return feed.populate('userId');
  }



  /**
   * Get all the feeds in the database of given user
   *
   * @param {string} userId - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Feed>>> {
    // const author = await UserCollection.findOneByUsername(username);
    return FeedModel.find({userId: userId}).populate('userId');
  }



  /**
   * Delete all the freets by the given author
   *
   * @param {string} userId - The id of author of freets
   */
  static async deleteManyOfUserId(userId: Types.ObjectId | string): Promise<void> {
    await FeedModel.deleteMany({userId:userId});
  }

    /**
   * Delete all the feeds with the given freetId
   *
   * @param {string} freetId - The id of author of freets
   */
     static async deleteManyOfFreetId(freetId: Types.ObjectId | string): Promise<void> {
      await FeedModel.deleteMany({freetId:freetId});
    }
}

export default FeedCollection;
