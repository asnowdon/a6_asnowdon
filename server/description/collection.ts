import type {HydratedDocument, Schema, Types} from 'mongoose';
import UserCollection from '../user/collection';
import type {description} from './model';
import descriptionModel from './model';

/**
 * This file contains a class with functionality to interact with Following stored
kalsjdklajdklsajdklsajlkdjaskldjasd * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class descriptionCollection {
  /**
   * Add a new description
   *
   * @param {string} userId - The userId of the user
   * @param {string} content - The content of the descript=ion
   * @return {Promise<HydratedDocument<description>>} - The newly created like
   */
     static async addOne(userId: Types.ObjectId | string, content: string): Promise<HydratedDocument<description>> {
      const description = new descriptionModel({userId,content});
      await description.save(); // Saves user to MongoDB
      return description;
    }


  /**
   * Delete a description from the collection.
   *
   * @param {string} userId - The userId of user 
   * @return {Promise<Boolean>} - true if the description has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const description = await descriptionModel.deleteOne({userId: userId});
    return description !== null;
  }



    /**
   * Get the user's description in the database
   *
   * @param {string} username - The username of the user 
   * @return {Promise<HydratedDocument<description>>} - the description
   */
       static async findOne(username:string): Promise<HydratedDocument<description>> {
        // Retrieves followers and sorts them alphabetically?
        // console.log(userId);
        // console.log("eeep");
        const user =  await UserCollection.findOneByUsername(username);
        // console.log(user);
        return descriptionModel.findOne({userId: user._id}).populate('userId');
        //this returns the likeModel objects (should i return the freets themselves)
    }
  
  /**
   * Update a description with the new content
   *
   * @param {string} userId - The userId of the user to update
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<description>>} - The newly updated freet
   */
   static async updateOne(userId: Types.ObjectId | string, content: string): Promise<HydratedDocument<description>> {
    const description = await descriptionModel.findOne({userId: userId});
    description.content = content;
    await description.save();
    return description.populate('userId');
  }

}

export default descriptionCollection;
