import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import followerCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followerValidator from '../follower/middleware';

import * as util from './util';
import { follower } from './model';
import FeedCollection from '../feed/collection';

const router = express.Router();

/**
 * Get all the followers
 *
 * @name GET /api/followers
 *
 * @return {follower[]} - A list of all the followers
 *                      
 */

/**
 * Get all follwers of a user.
 *
 * @name GET /api/followers?username=username
 *
 * @return {follower[]} - An array of freets created by user with id
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    // console.log("IN ROUTER");
     if (!req.query.username && !req.query.freetId) {
      res.status(400).json({
        error: 'A value Must Be Inputted.'
      });
    } 
    if (req.query.username !== undefined) {
      next();
      return;
    }
    const allFollowers = await followerCollection.findAll();
    // console.log(allFollowers);
    // const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(allFollowers);
  },
  [
    followerValidator.isUserExistsQuery
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("in NEXT");
    // console.log(req.query);
    if (req.query.followerUsername !== undefined) {
      next();
      return;
    }
    const userFollowers = await followerCollection.findAllFollowersOfUsername(req.query.username as string);
    // console.log("user followers");
    // console.log(userFollowers);
    // const response = authorFreets.map(util.constructFreetResponse);
    // console.log(userFollowers);
    res.status(200).json(userFollowers);
  },
  [
    followerValidator.isFollowerExists
  ],
  async (req: Request, res: Response) => {
    // console.log("in NEXT"); 
    // console.log(req.query);
    const userFollowers = await followerCollection.findOneFollowerOfUserId(req.query.username as string,req.query.followerUsername as string);
    // const response = authorFreets.map(util.constructFreetResponse);
    // console.log(userFollowers);
    res.status(200).json(userFollowers);
  }

);

/**
 * Follow a User.
 *
 * @name POST /api/followers
 *
 * @param {Types.ObjectId} userId - The userId of the new followerfollowing 
 * @return {followerFollowingResponse} - The created followerfollowing
 * @throws {403} - If username is invalid
 *
 */
router.post(
  '/:username?',
  [
    userValidator.isUserLoggedIn,
    followerValidator.isUserExists,
    followerValidator.isFollowerAlreadyExists
  ],
  //user thats logged in follows req.body.id
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    // console.log(req.body);
    // console.log(req.query);

    const follower = await followerCollection.addOne(req.body.username as string, userId); //userId is a follower of 
    // const follower = await followerCollection.addOne(req.query.username as string, userId); //userId is a follower of 

    const freets = await FreetCollection.findAllByUsername(req.body.username as string);


    res.status(201).json({
      message: `Your follower has been created successfully`,
      follower: follower
      // followerFollowing: followerFollowing
    });
  }
);

/**
 * Delete a follower.
 *
 * @name DELETE /api/followers
 *
 * @param {Types.ObjectId} userId - The userId of the user 
 * @param {string} followersUserId - The userId of user follower user follows
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
 router.delete(
  '/:id?',
  [
    userValidator.isUserLoggedIn,
    followerValidator.isFollowerExists 
  ],
  async (req: Request, res: Response) => {
    // console.log(req.params);
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await followerCollection.deleteOne(userId, req.params.id);
    res.status(200).json({
      message: 'Follower has been deleted successfully.'
    });
  }
);


export {router as followerRouter};
