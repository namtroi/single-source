import type { RequestHandler } from 'express';
import db from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface AuthMiddleware {
  validateBody: RequestHandler;
  checkUserExists: RequestHandler;
  hashPassword: RequestHandler;
  findUser: RequestHandler;
  verifyToken: RequestHandler;
  findUserByParams: RequestHandler;
}

interface JwtPayload {
  id: number;
}

const authMiddleware = {} as AuthMiddleware;

authMiddleware.validateBody = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next({
      log: 'authMiddleware.validateBody: Missing username or password',
      status: 400,
      message: { err: 'Username and password are required' },
    });
  }

  return next();
};

authMiddleware.checkUserExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(query, [username]);

    if (result.rows.length > 0) {
      return next({
        log: 'authMiddleware.checkUserExists: Username already taken',
        status: 400,
        message: { err: 'Username already exists' },
      });
    }

    return next();
  } catch (error) {
    return next({
      log: `authMiddleware.checkUserExists: DB error - ${error}`,
      status: 500,
      message: { err: 'Error checking database' },
    });
  }
};

authMiddleware.hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    res.locals.password_hash = hash;
    return next();
  } catch (error) {
    return next({
      log: `authMiddleware.hashPassword: Error hashing password - ${error}`,
      status: 500,
      message: { err: 'Error processing registration' },
    });
  }
};

authMiddleware.findUser = async (req, res, next) => {
  try {
    const { username } = req.body;
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(query, [username]);

    if (result.rows.length === 0) {
      return next({
        log: 'authMiddleware.findUser: Username not found',
        status: 401,
        message: { err: 'Username not found' },
      });
    }

    res.locals.user = result.rows[0];

    return next();
  } catch (error) {
    return next({
      log: `authMiddleware.findUser: DB error - ${error}`,
      status: 500,
      message: { err: 'Error checking database' },
    });
  }
};

authMiddleware.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next({
        log: 'authMiddleware.verifyToken: No token provided',
        status: 401,
        message: { err: 'Unauthorized: No token provided' },
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    res.locals.userId = decoded.id;
    return next();
  } catch (error) {
    return next({
      log: `authMiddleware.verifyToken: Invalid token - ${error}`,
      status: 403,
      message: { err: 'Forbidden: Invalid token' },
    });
  }
};

authMiddleware.findUserByParams = async (req, res, next) => {
  try {
    const username = req.params.username;
    console.log(username);
    const query = 'SELECT id, username FROM users WHERE username = $1';
    const result = await db.query(query, [username]);

    console.log(result.rows);

    if (result.rows.length === 0) {
      return next({
        log: 'authMiddleware.findUserByParams: Username not found',
        status: 404,
        message: { err: 'Username not found' },
      });
    }

    res.locals.profile = result.rows[0];

    return next();
  } catch (error) {
    return next({
      log: `authMiddleware.findUserByParams: DB error - ${error}`,
      status: 500,
      message: { err: 'Error checking database' },
    });
  }
};

export default authMiddleware;
