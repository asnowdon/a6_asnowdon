import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import likeCollection from '../like/collection';
import bestFreetCollection from './collection';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';
import * as followerValidator from '../follower/middleware';
import * as likeValidator from '../like/middleware';
import * as bestFreetValidator from '../bestFreet/middleware';

import * as util from './util';
import { bestFreet } from './model';

const router = express.Router();


/**
 * Get all bestFreet's of a freet.
 *
 * @name GET /api/bestFreets?freetId=FreetId
 *
 * @return {bestFreet[]} - An array of bestFreets created by user with id
 * @throws {400} - If id is not given
 * @throws {404} - If no freet has given id
 *
 */

/**
 * Get bestFreet of a user.
 *
 * @name GET /api/bestFreet?username=username
 *
 * @return {bestFreet[]} - An array of bestFreet's created by user with userId
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/', //TODO ADD MIDDLEWARE
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    // console.log("IN ROUTER");
    // console.log(req.query);
    if (!req.query.username && !req.query.freetId) {
      res.status(400).json({
        error: 'A Value Must Be Inputted.'
      });
    } else if (req.query.username !== undefined) {
      next();
      return;
    }else if(req.query.freetId !== undefined){
      // console.log("freet ID spot");
      const allLikesOfFreet = await bestFreetCollection.findByFreet(req.query.freetId as string);
      const response = allLikesOfFreet.map(util.constructBestFreetResponse);

      res.status(200).json(response);
    }else{
      res.status(403).json({error:{inputs:'value must be inputted.'}});
    }
    // console.log(allFollowers);
    // const response = allFreets.map(util.constructFreetResponse);
  },
  // [
  //   userValidator.isUserLoggedIn
  // ],
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("in NEXT");
    // console.log(req.query);
    const user = await UserCollection.findOneByUsername(req.query.username as string);
    const allBestFreetsOfUser = await bestFreetCollection.findByUserId(user._id);
    // const response = authorFreets.map(util.constructFreetResponse);
    // console.log(userFollowers);
    const response =await Promise.all(allBestFreetsOfUser.map(util.constructBestFreetResponse)); 
    console.log(response);
    res.status(200).json(response);
  }
);


/**
 * bestFreet a freet. Only works if you haven't best freeted a freet within 24 hours
 *
 * @name POST /api/bestFreets
 *
 * @param {Types.ObjectId} freetId - The id of the freet
 * @return {like} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {403} - If freetId is invalid
 * @throws {404} - If bestFreet has been used within 24 hours.
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isFreetExists, //  (freet id = req.params.freetId)
    bestFreetValidator.isBestFreetElligible // (userId = req.session.userId) 
  ],
  async (req: Request, res: Response) => {
    // console.log(req.params);
    // console.log(req.body);
    if (!req.body.freetId) {
      res.status(400).json({
        error: 'No freetId.'
      });
      return;
    }
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const bestFreet = await bestFreetCollection.addOne(userId, req.body.freetId);
    // req.userId = followerFollowing._id.toString();
    res.status(201).json({
      message: `Your bestFreet has been created successfully`,
      bestFreet: bestFreet
    });
  }
);

/**
 * Delete a bestFreet. un bestFreet
 *
 * @name DELETE /api/bestFreet/:?freetId?
 *
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {403} - If freetId is invalid
 */
 router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn, 
    freetValidator.isFreetExists,
    // bestFreetValidator.isBestFreetExists
    // likeValidator.isLikeExists //is bestFreetexitst
   //check if like [user  = req.session.userId, freet = req.params.freetId ] exists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await bestFreetCollection.deleteOne(req.params.freetId,userId);
    res.status(200).json({
      message: 'Best Freet has been deleted successfully.'
    });
  }
);


export {router as bestFreetRouter};
