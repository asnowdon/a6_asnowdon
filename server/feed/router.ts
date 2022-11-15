import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import FeedCollection from './collection';
import followerCollection from '../follower/collection';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get the feeds
 *
 * @name GET /api/feeds
 *
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */

router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    const following = await followerCollection.findAllFollowing(userId);
    // console.log(following);
    // following.forEach(async follow => {
    for(const follow of following){
      // console.log('a');
      // console.log(follow);
      const acctFreets = await FreetCollection.findAllByUserId(follow.userId);
      // console.log(acctFreets)
      // acctFreets.forEach(async freet => {
      for(const freet of acctFreets){
        // console.log('nn');
        await FeedCollection.addOne(userId, freet._id);
      }
    }
    
    //should add all of followings freets to my own thing

    let allFeedsConverted;
    const allFeeds = await FeedCollection.findAllByUserId(userId);
    if(allFeeds.length >=1){
      const unresolvedFeeds = await allFeeds.map(util.constructFeedResponse);
      allFeedsConverted = await Promise.all(unresolvedFeeds);
    }

    res.status(200).json({
        message: 'Your feed was created succesfully.',
        feed: (allFeedsConverted ? allFeedsConverted : allFeeds)
      });
    await FeedCollection.deleteManyOfUserId(userId);
  }
);

export {router as feedRouter};
