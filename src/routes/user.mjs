// USER ROUTES
import { Router } from "express";
import UserController from "../controller/user.mjs";
import SchemaValidation from "../validation/schemaValidationHelper.mjs";
import { signUp, updateUser } from "../validation/schema/user.mjs";
import Authorization from "../middleware/authorization.mjs";

const router = Router();

router.get("/all", Authorization, UserController.get_all_user);
router.get("/:id", Authorization, UserController.get_a_user);

router.post("/signUp", SchemaValidation.validateSchema(signUp), UserController.signUp);
router.post("/signIn", UserController.signIn);

router.put("/update/:id", Authorization, SchemaValidation.validateSchema(updateUser), UserController.updateUser);
router.put("/:id/follow", Authorization, UserController.follow_a_user);
router.put("/:id/unfollow", Authorization, UserController.unfollow_a_user);

router.delete("/delete/:id", Authorization, UserController.deleteUser);

export default router
