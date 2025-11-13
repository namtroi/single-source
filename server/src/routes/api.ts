import express from "express";
import { updateTheme } from "../controllers/theme.controller";
import { uploadAvatar } from "../middleware/upload.middleware";
import { uploadProfileImage } from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import linkController from "../controllers/link.controller";
import { validate } from "../middleware/validation.middleware";
import { linkSchema } from "../schemas";

const apiRouter = express.Router();
console.log("✅ server.ts loaded apiRouter import successfully");
console.log("✅ server.ts loaded apiRouter import successfully");

apiRouter.post(
  "/auth/register",
  authMiddleware.validateBody,
  authMiddleware.checkUserExists,
  authMiddleware.hashPassword,
  authController.registerUser
);
console.log("✅ server.ts loaded apiRouter import successfully");
console.log("✅ server.ts loaded apiRouter import successfully");

apiRouter.post(
  "/auth/login",
  authMiddleware.validateBody,
  authMiddleware.findUser,
  authController.loginUser
);
console.log("✅ server.ts loaded apiRouter import successfully");

apiRouter.patch("/users/theme", authMiddleware.verifyToken, updateTheme);
console.log("✅ server.ts loaded apiRouter import successfully");

apiRouter.patch("/users/theme", authMiddleware.verifyToken, updateTheme);

apiRouter.get(
  "/users/:username",
  authMiddleware.findUserByParams,
  linkController.getPublicProfile
);
console.log("✅ server.ts loaded apiRouter import successfully");
console.log("✅ server.ts loaded apiRouter import successfully");

apiRouter.get("/links", authMiddleware.verifyToken, linkController.getMyLinks);
console.log("✅ server.ts loaded apiRouter import successfully");
console.log("✅ server.ts loaded apiRouter import successfully");

apiRouter.post(
  "/links",
  authMiddleware.verifyToken,
  validate(linkSchema),
  linkController.createLink
);
console.log("✅ server.ts loaded apiRouter import successfully");
console.log("✅ server.ts loaded apiRouter import successfully");

apiRouter.put(
  "/links/:linkId",
  authMiddleware.verifyToken,
  validate(linkSchema),
  authMiddleware.verifyLinkOwnership,
  linkController.updateLink
);
console.log("✅ server.ts loaded apiRouter import successfully");
console.log("✅ server.ts loaded apiRouter import successfully");

apiRouter.delete(
  "/links/:linkId",
  authMiddleware.verifyToken,
  authMiddleware.verifyLinkOwnership,
  linkController.deleteLink
);

console.log("✅ server.ts loaded UPDATE import successfully");

apiRouter.post(
  "/users/upload",
  authMiddleware.verifyToken,
  uploadAvatar.single("avatar"),
  uploadProfileImage
);

export default apiRouter;
