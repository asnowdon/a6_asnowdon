import type {HydratedDocument, Schema, Types} from 'mongoose';
import type {bestFreet} from './model';
import bestFreetModel from './model';

/**
 * This file contains a class with functionality to interact with Following stored
kalsjdklajdklsajdklsajlkdjaskldjasd * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class bestFreetCollection {
  /**
   * Add a new best Freet
   *
   * @param {string} freetId - The freetId of the freet
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<like>>} - The newly created like
   */
     static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<bestFreet>> {
      const date = new Date();
      const bestFreet = new bestFreetModel({
        userId,
        freetId,
        dateUsed: date
      });
      await bestFreet.save(); // Saves user to MongoDB
      return bestFreet;
    }


  /**
   * Delete a bestFreet from the collection. UnbestFreet
   *
   * @param {string} freetId - The freetId of freet 
   * @param {string} userId - The userId of user 
   * @return {Promise<Boolean>} - true if the bestFreet has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const like = await bestFreetModel.deleteOne({freetId: freetId, userId: userId});
    return like !== null;
  }

  // /**
  //  * Delete all the likes by the given user
  //  *
  //  * @param {string} userId - The id of user 
  //  */
  //    static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
  //     await likeModel.deleteMany({userId:userId});
  //   }

  /**
   * Get the userId's bestFreet in the database
   *
   * @param {string} userId - The userId of the user 
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findByUserId(userId: Types.ObjectId | string):Promise<Array<HydratedDocument<bestFreet>>> {
        // Retrieves followers and sorts them alphabetically?
        // console.log(userId);
        // console.log("eeep");
        return bestFreetModel.find({userId: userId}).sort({dateUsed:-1}).populate('userId');
        //this returns the likeModel objects (should i return the freets themselves)
    }


  //     /**
  //  * Find a bestFreet by freetId 
  //  *
  //  * @param {string} freetId - The id of the freet to find
  //  * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
  //  */
  // static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
  //   return FreetModel.findOne({_id: freetId}).populate('authorId');
  // }

      /**
   * Get the bestFreets associated with freetId in the database
   *
   * @param {string} freetId - The userId of the user 
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
       static async findByFreet(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<bestFreet>>> {
        // Retrieves followers and sorts them alphabetically?
        // console.log(userId);
        // console.log("eeep");
        return bestFreetModel.find({freetId: freetId}).sort({}).populate('userId');
        //this returns the likeModel objects (should i return the freets themselves)
    }



  // /**
  //  * Get all the userId's likes in the database
  //  *
  //  * @param {string} userId - The userId of the user 
  //  * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
  //  */
  //    static async findAllLikesOfUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<like>>> {
  //     // Retrieves followers and sorts them alphabetically?
  //     // console.log(userId);
  //     // console.log("eeep");
  //     return likeModel.find({userId: userId}).sort({}).populate('userId');
  //     //this returns the likeModel objects (should i return the freets themselves)
  //   }

  
  
  //   /**
  //    * Get all the userId's likes in the database
  //    *
  //    * @param {string} userId - The userId of the user 
  //    * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
  //    */
  //      static async findAllLikesOfFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<like>>> {
  //       // Retrieves followers and sorts them alphabetically?
  //       // console.log(userId);
  //       // console.log("eeep");
  //       return likeModel.find({freetId: freetId}).sort({}).populate('userId');
  //       //this returns the likeModel objects (should i return the freets themselves)
  //     }

}

export default bestFreetCollection;
