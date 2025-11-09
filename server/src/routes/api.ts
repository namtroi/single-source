import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import linkController from '../controllers/link.controller';

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

apiRouter.get(
  '/users/:username',
  authMiddleware.findUserByParams,
  linkController.getPublicProfile
);

export default apiRouter;
