import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import likeCollection from '../like/collection';
import descriptionCollection from './collection';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';
import * as followerValidator from '../follower/middleware';
import * as likeValidator from '../like/middleware';
import * as descriptionValidator from './middleware';

import * as util from './util';
import { description } from './model';

const router = express.Router();



/**
 * Get description of a user.
 *
 * @name GET /api/descriptions?username=username
 *
 * @return {description} - An description created by user with userId
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given id
 *
 */
router.get(
  '/:username?',
    [
    descriptionValidator.isUserExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    // Check if userId exists
    if (!req.query.username) {
      res.status(400).json({
        error: 'A Username Must Be Inputted.'
      });
    } else if (req.query.username !== undefined) {
      const description = await descriptionCollection.findOne(req.query.username as string);
      res.status(201).json({
        message: `The description of ${req.query.username} was successfully found.`,
        description: description
        // user: util.constructUserResponse(user)
      });
    }else{
      res.status(403).json({error:{inputs:'value must be inputted.'}});
    }
  }
);


/**
 * Modify a description
 *
 * @name PUT /api/descriptions/
 *
 * @param {string} content - the new content for the description
 * @return {description} - the updated description
 * @throws {403} - if the user is not logged in 
 * @throws {400} - If the description content is empty or a stream of empty spaces
 * @throws {413} - If the description content is more than 60 characters long
 */
 router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    // freetValidator.isFreetExists,
    // freetValidator.isValidFreetModifier,
    descriptionValidator.isValidDescriptionContent
  ],
  async (req: Request, res: Response) => {
    const description = await descriptionCollection.updateOne(req.session.userId, req.body.content);
    res.status(200).json({
      message: 'Your description was updated successfully.',
      description: description
      // freet: util.constructFreetResponse(freet)
    });
  }
);




export {router as descriptionRouter};
