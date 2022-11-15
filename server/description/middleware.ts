import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import LikeCollection from './collection';



/**
 * Checks if a user with userId in req.query exists
 */
 const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('user');
  // console.log(req.query.username);
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


/**
 * Checks if the content of the description in req.body is valid, i.e not a stream of empty
 * spaces and not more than 60 characters
 */
 const isValidDescriptionContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Description content must be at least one character long.'
    });
    return;
  }

  if (content.length > 60) {
    res.status(413).json({
      error: 'Description content must be no more than 60 characters.'
    });
    return;
  }

  next();
};


export {
  isUserExists,
  isValidDescriptionContent
};
