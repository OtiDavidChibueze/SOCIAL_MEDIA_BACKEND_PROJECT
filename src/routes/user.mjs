// USER ROUTES
import { Router } from "express";
import UserController from "../controller/user.mjs";
import schemaValidationHelper from "../validation/schemaValidationHelper.mjs";
import { updateUser } from "../validation/schema/user.mjs";
import Authorization from "../middleware/authorization.mjs";

const router = Router();

router.get("/all", UserController.get_all_user);
router.get("/:id", UserController.get_a_user);

router.post("/signUp", UserController.signUp);
router.post("/signIn", UserController.signIn);

router.put("/update/:id", UserController.updateUser);
router.put("/:id/follow", UserController.follow_a_user);
router.put("/:id/unfollow", UserController.unfollow_a_user);

router.delete("/delete/:id", Authorization, UserController.deleteUser);

export default router;
