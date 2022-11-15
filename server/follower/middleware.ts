import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import followerCollection from './collection';

// /**
//  * Checks if the current session user (if any) still exists in the database, for instance,
//  * a user may try to post a freet in some browser while the account has been deleted in another or
//  * when a user tries to modify an account in some browser while it has been deleted in another
//  */
// const isFollowerExists = async (req: Request, res: Response, next: NextFunction) => {
//   if (req.body.userId) {
//     const user = await followerCollection.findOneFollowerOfUserId(req.body.userId, req.body.followsUserId);

//     if (!user) {
//       req.body.userId = undefined;
//       res.status(500).json({
//         error: {
//           userNotFound: 'UserId was not recognized.'
//         }
//       });
//       return;
//     }
//   }

//   next();
// };




/**
 * Checks if a user with userId in req.body exists
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query);
  console.log(req.body);

  if (!req.body.username) {
    res.status(400).json({
      error: 'Must Provide Username.'
    });
    return;
  }
  const user = await UserCollection.findOneByUsername(req.body.username as string);
  if (!user) {
    res.status(404).json({
      error: `A user with userId ${req.body.username as string} does not exist.`
    });
    return;
  }

  next();
};

const isUserExistsQuery = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.query);
  // console.log(req.body);

  if (!req.query.username) {
    res.status(400).json({
      error: 'Must Provide Username.'
    });
    return;
  }
  const user = await UserCollection.findOneByUsername(req.query.username as string);
  if (!user) {
    res.status(404).json({
      error: `A user with userId ${req.query.username as string} does not exist.`
    });
    return;
  }

  next();
};

/*
* Checks if a user & follower pair with userId and followsUserId in req.query exists
*/
const isFollowerExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.session.userId as string) ?? (req.query.userId as string) ?? '';
  // console.log(userId);
  // console.log(req.params.id);
  if (!(userId) || !req.params.id) {
    res.status(400).json({
      error: 'Provided userId must be nonempty.'
    });
    return;
  }

  const user = await followerCollection.findOneFollowerOfUserId(req.query.userId as string, req.query.followsUserId as string);
  if (!user) {
    res.status(404).json({
      error: `A follower obj of userId ${req.query.userId as string} and followsId ${req.query.followsUserId as string} does not exist.`
    });
    return;
  }

  next();
};

/*
* Checks if a user & follower pair with userId and followsUserId in req.query exists
*/
const isFollowerAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.session.userId as string);
  // console.log(userId);
  // console.log(req.params.id);
  if (!(userId)) {
    res.status(400).json({
      error: 'Provided userId must be nonempty.'
    });
    return;
  }
  const followed = await UserCollection.findOneByUsername(req.body.username);
  const followerObj = await followerCollection.findOneFollowerOfUserId(followed._id, userId);
  console.log(followerObj);
  if (followerObj.length > 0) {
    res.status(404).json({
      error: `You already follow  ${req.body.username as string}.`
    });
    return;
  }

  next();
};
export {
  isUserExists,
  isFollowerExists,
  isFollowerAlreadyExists,
  isUserExistsQuery
};
