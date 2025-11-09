import type { RequestHandler } from 'express';
import db from '../db';

interface LinkController {
  getPublicProfile: RequestHandler;
}

const linkController = {} as LinkController;

linkController.getPublicProfile = async (req, res, next) => {
  try {
    const { id, username } = res.locals.profile;

    const queryGetProfile = `SELECT id, title, url FROM links WHERE user_id = $1`;

    const result = await db.query(queryGetProfile, [id]);

    res.locals.profile.links = result.rows;
    return res.status(200).json(res.locals.profile);
  } catch (error) {
    return next({
      log: `userController.getPublicProfile - ${error}`,
      status: 500,
      message: { err: 'Failed to get user profile' },
    });
  }
};

export default linkController;
