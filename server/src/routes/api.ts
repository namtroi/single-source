import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import linkController from "../controllers/link.controller";
import { validate } from "../middleware/validation.middleware";
import { linkSchema } from "../schemas";

const apiRouter = express.Router();

apiRouter.post(
  "/auth/register",
  authMiddleware.validateBody,
  authMiddleware.checkUserExists,
  authMiddleware.hashPassword,
  authController.registerUser
);

apiRouter.post(
  "/auth/login",
  authMiddleware.validateBody,
  authMiddleware.findUser,
  authController.loginUser
);

apiRouter.get(
  "/users/:username",
  authMiddleware.findUserByParams,
  linkController.getPublicProfile
);

apiRouter.get("/links", authMiddleware.verifyToken, linkController.getMyLinks);

apiRouter.post(
  "/links",
  authMiddleware.verifyToken,
  validate(linkSchema),
  linkController.createLink
);

apiRouter.put(
  "/links/:linkId",
  authMiddleware.verifyToken,
  validate(linkSchema),
  authMiddleware.verifyLinkOwnership,
  linkController.updateLink
);

apiRouter.delete(
  "/links/:linkId",
  authMiddleware.verifyToken,
  authMiddleware.verifyLinkOwnership,
  linkController.deleteLink
);

//call middleware for updating theme
console.log({
  verifyToken: typeof authMiddleware.verifyToken,
  findUserByParams: typeof authMiddleware.findUserByParams,
  changeTheme: typeof authController.changeTheme,
});

export default apiRouter;
