import type { RequestHandler } from 'express';
import db from '../db';

interface LinkController {
  getPublicProfile: RequestHandler;
  getMyLinks: RequestHandler;
  createLink: RequestHandler;
  updateLink: RequestHandler;
  deleteLink: RequestHandler;
}

const linkController = {} as LinkController;

linkController.getPublicProfile = async (req, res, next) => {
  try {
    const { id } = res.locals.profile;
        // get all links for that user
    const linksQuery = `SELECT id, title, url FROM links WHERE user_id = $1 ORDER BY id DESC`;
    const linksResult = await db.query(linksQuery, [id]);

    // get that user's saved theme
    const themeQuery = `SELECT theme_preference FROM users WHERE id = $1 LIMIT 1`;
    const themeResult = await db.query(themeQuery, [id]);
    const theme_preference = themeResult.rows[0]?.theme_preference ?? null;

    // attach both to the profile object
    res.locals.profile.links = linksResult.rows;
    res.locals.profile.theme_preference = theme_preference;

    // send everything back
    return res.status(200).json(res.locals.profile);
} catch (error) {
    return next({
      log: `linkController.getPublicProfile - ${error}`,
      status: 500,
      message: { err: "Failed to get user profile" },
    });
  }
};

linkController.getMyLinks = async (req, res, next) => {
  try {
    const userId = res.locals.userId;

    const query = `
      SELECT id, title, url
      FROM public.links
      WHERE user_id = $1
      ORDER BY created_at ASC;
    `;

    const result = await db.query(query, [userId]);
    return res.status(200).json(result.rows);
  } catch (error) {
    return next({
      log: `linkController.getMyLinks - ${error}`,
      status: 500,
      message: { err: "Failed to get links" },
    });
  }
};

linkController.createLink = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const { title, url } = req.body;
    const query = `INSERT INTO links (title, url, user_id) VALUES ($1, $2, $3) RETURNING *`;
    const result = await db.query(query, [title, url, userId]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next({
      log: `linkController.createLink - ${error}`,
      status: 500,
      message: { err: 'Failed to create a link' },
    });
  }
};

linkController.updateLink = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const { title, url } = req.body;
    const query = `UPDATE links SET title = $1, url = $2 WHERE id = $3 RETURNING *`;
    const result = await db.query(query, [title, url, linkId]);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return next({
      log: `linkController.updateLink - ${error}`,
      status: 500,
      message: { err: 'Failed to update the link' },
    });
  }
};

linkController.deleteLink = async (req, res, next) => {
  try {
    const { linkId } = req.params;

    const query = `DELETE FROM links WHERE id = $1`;
    const result = await db.query(query, [linkId]);
    return res.status(204).send();
  } catch (error) {
    return next({
      log: `linkController.deleteLink - ${error}`,
      status: 500,
      message: { err: 'Failed to delete the link' },
    });
  }
};

export default linkController;
