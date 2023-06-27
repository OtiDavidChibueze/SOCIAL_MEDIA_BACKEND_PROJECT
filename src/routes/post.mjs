// USER ROUTES
import { Router } from "express";
import PostController from "../controller/post.mjs";
import schemaValidationHelper from "../validation/schemaValidationHelper.mjs";
import { postValidation } from "../validation/schema/post.mjs";
import Authorization from "../middleware/authorization.mjs";

const router = Router();

router.get("/get/:id", Authorization, PostController.get_a_post);
// router.get(
//   "/timeline/:id",
//   Authorization,
//   PostController.get_a_user_timeline_posts
// );

router.post(
  "/create",
  Authorization,
  // schemaValidationHelper.validateSchema(postValidation),
  PostController.createPost
);

export default router;
