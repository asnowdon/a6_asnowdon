import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import LikeCollection from './collection';



/**
 * Checks if a freet with freetId is req.body exists
 */
 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.params);
  // console.log(req.body);
  if(req.body.freetId == undefined){
    res.status(404).json({
      error: {
        missingInput: `Must input a freetId.`
      }
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.body exists
 */
 const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.params.freetId) : '';
  if (!like || like.length == 0) {
    res.status(404).json({
      error: {
        freetNotFound: `Like with User Id ${req.session.userId} freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.body exists
 */
 const isLikeAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.body.freetId) : '';
  if (like != '') {
    res.status(404).json({
      error: `Like with User Id ${req.session.userId} freet ID ${req.body.freetId} already exists.`
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as author id in req.query exists
 */
 const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username) {
    res.status(400).json({
      error: 'Provided username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByUsername(req.query.username as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.query.username as string} does not exist.`
    });
    return;
  }

  next();
};



export {
  isFreetExists,
  isLikeExists,
  isUserExists,
  isLikeAlreadyExists
};
