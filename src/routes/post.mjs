//* USER ROUTES
import { Router } from "express";
import PostController from "../controller/post.mjs";
import schemaValidationHelper from "../validation/schemaValidationHelper.mjs";
import { postValidation, updatePost } from "../validation/schema/post.mjs";
import Authorization from "../middleware/authorization.mjs";

const router = Router();


// GET
router.get(
  "/timeline",
  Authorization,
  PostController.get_all_posts_and_followingFriends_posts
);
router.get("/:id", Authorization, PostController.get_a_post_by_id);

// POST
router.post(
  "/create",
  Authorization,
  schemaValidationHelper.validateSchema(postValidation),
  PostController.createPost
);

// PUT
router.put(
  "/update/:id",
  Authorization,
  schemaValidationHelper.validateSchema(updatePost),
  PostController.update_a_post_by_id
);
router.put('/like/:id', Authorization, PostController.like_a_post_by_id_OR_dislike_a_post_by_id)
router.put('/comment', Authorization, PostController.comment_to_a_post)

//DELETE
router.delete('/delete/:id', Authorization, PostController.delete_a_post_by_id)



export default router;
