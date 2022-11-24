import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import LikeCollection from './collection';
import bestFreetCollection from './collection';
import e from 'express';



/**
 * Checks if a freet with freetId is req.body exists
 */
 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
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
 const isBestFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const bestFreet = validFormat ? await bestFreetCollection.findByUserId(req.session.userId) : '';
  if (!bestFreet || bestFreet.length == 0) {
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
 * makes sure user can use a bestFreet
 */
 const isBestFreetElligible = async (req: Request, res: Response, next: NextFunction) => {

  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const bestFreets = validFormat ? await bestFreetCollection.findByUserId(req.session.userId) : '';
  // console.log(validFormat);
  // console.log("bestfreets");
  // console.log(bestFreets);
  if(bestFreets != ''){
    const latestBestFreet = bestFreets[0];
    const hour24= 24 * 60 * 60 * 1000;//hour * min * sec * msec
    const hour24ago= Date.now() - hour24;
    // console.log("last used");
    // console.log(latestBestFreet.dateUsed.getTime());
    // console.log("24 hour ago");
    // console.log(hour24ago);
      if(latestBestFreet.dateUsed.getTime() > hour24ago){
        res.status(403).json({
          error: `You already used your Best Freet today!`
        });
        return;
        //fail
      }  
    
  }
  next();
};


export {
  isFreetExists,
  isBestFreetExists,
  isBestFreetElligible
};
