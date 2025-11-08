import type { RequestHandler } from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface AuthController {
  registerUser: RequestHandler;
  loginUser: RequestHandler;
}

const authController = {} as AuthController;

authController.registerUser = async (req, res, next) => {
  try {
    console.log("authController.registerUser");
    
    const { username } = req.body;
    const { password_hash } = res.locals;

    const queryRegisterUser = `
      INSERT INTO users (username, password_hash) 
      VALUES ($1, $2) 
      RETURNING id, username
    `;

    const newUser = await db.query(queryRegisterUser, [
      username,
      password_hash,
    ]);
    const createdUser = newUser.rows[0];

    const payload = { id: createdUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    return res.status(201).json({
      token,
      user: {
        id: createdUser.id,
        username: createdUser.username,
      },
    });
  } catch (error) {
    return next({
      log: `authController.registerUser - ${error}`,
      status: 500,
      message: { err: 'Failed to register user' },
    });
  }
};

authController.loginUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = res.locals.user;

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return next({
        log: 'authMiddleware.checkUserExists: Invalid credentials',
        status: 401,
        message: { err: 'Invalid credentials' },
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return next({
      log: `authController.loginUser - Error: ${error}`,
      status: 500,
      message: { err: 'Failed to login' },
    });
  }
};

export default authController;
