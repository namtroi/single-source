import express from 'express';
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const apiRouter = express.Router();

apiRouter.post(
  '/auth/register',
  authMiddleware.validateBody,
  authMiddleware.checkUserExists,
  authMiddleware.hashPassword,
  authController.registerUser
);

apiRouter.post(
  '/auth/login',
  authMiddleware.validateBody,
  authMiddleware.findUser,
  authController.loginUser
);

export default apiRouter;
