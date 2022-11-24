import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import likeCollection from './collection';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';
import * as followerValidator from '../follower/middleware';
import * as likeValidator from '../like/middleware';

import * as util from './util';
import { like } from './model';

const router = express.Router();


/**
 * Get all likes of a freet.
 *
 * @name GET /api/likes?freetId=FreetId
 *
 * @return {like[]} - An array of likes of freetId freet
 * @throws {400} - If id is not given
 * @throws {404} - If no freet has given id
 *
 */

/**
 * Get all likes of a user.
 *
 * @name GET /api/likes?username=username
 *
 * @return {like[]} - An array of likes created by user with username
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    // console.log("IN ROUTER");
    // console.log(req.query);
    // console.log(req.params);
    if (!req.query.username && !req.query.freetId) {
      res.status(400).json({
        error: 'A value Must Be Inputted.'
      });
      return;
    } else if (req.query.username !== undefined) {
      next();
    }else if(req.query.freetId !== undefined){
      // console.log("freet ID spot");
      const allLikesOfFreet = await likeCollection.findAllLikesOfFreetId(req.query.freetId as string);
      const likeResponses = allLikesOfFreet.map(util.constructLikeResponse)
      res.status(200).json(allLikesOfFreet);
    }else{
      res.status(403).json({error:{inputs:'value must be inputted.'}});
      return;
    }
    // console.log(allFollowers);
    // const response = allFreets.map(util.constructFreetResponse);
  },
  [
    likeValidator.isUserExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("in NEXT");
    // console.log(req.query);
    const allLikesOfUser = await likeCollection.findAllLikesOfUsername(req.query.username as string);
    // console.log(allLikesOfUser);
    // const allLikesOfUser = await likeCollection.findAllLikesOfUserId(req.query.userId as string);
    // const response = authorFreets.map(util.constructFreetResponse);
    // console.log(userFollowers);
    const likeResponses = allLikesOfUser.map(util.constructLikeResponse)
    res.status(200).json(allLikesOfUser);
  }
);


/**
 * like a freet.
 *
 * @name POST /api/like
 *
 * @param {Types.ObjectId} freetId - The id of the freet
 * @return {like} - The created like
 * @throws {403} - If freetId is invalid
 *
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isFreetExists, //where does freet id have to be
    likeValidator.isLikeAlreadyExists

  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await likeCollection.addOne(userId, req.body.freetId);
    // req.userId = followerFollowing._id.toString();
    res.status(201).json({
      message: `Your like has been created successfully`,
      like: like
    });
  }
);

/**
 * Delete a like. unlike
 *
 * @name DELETE /api/like/:id
 *
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
 router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn, 
    freetValidator.isFreetExists,
    likeValidator.isLikeExists
   //check if like [user  = req.session.userId, freet = req.params.freetId ] exists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await likeCollection.deleteOne(userId,req.params.freetId);
    res.status(200).json({
      message: 'Like has been deleted successfully.'
    });
  }
);


export {router as likeRouter};
