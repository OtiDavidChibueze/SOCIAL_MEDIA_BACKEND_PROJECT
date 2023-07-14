// USER ROUTES
import { Router } from "express";
import UserController from "../controller/user.mjs";
import SchemaValidation from "../validation/schemaValidationHelper.mjs";
import { signUp, updateUser, newPassword, forgottenPassword } from "../validation/schema/user.mjs";
import Authorization from "../middleware/authorization.mjs";

const router = Router();

// GET
router.get("/all", Authorization, UserController.get_all_user);
router.get("/all/counts", Authorization, UserController.get_all_users_counts);
router.get("/:id", Authorization, UserController.get_a_user);
router.get('/all/admins', Authorization, UserController.get_all_admins_and_counts);
router.get('/all/superAdmins', Authorization, UserController.get_all_superAdmins_and_counts);

// POST
router.post("/signUp", SchemaValidation.validateSchema(signUp), UserController.signUp);
router.post("/signIn", UserController.signIn);
router.post('/forgotten/password', SchemaValidation.validateSchema(forgottenPassword), UserController.forgottenPassword);

// PUT
router.put("/update/:id", Authorization, SchemaValidation.validateSchema(updateUser), UserController.updateUserById);
router.put("/:id/follow", Authorization, UserController.follow_a_user);
router.put("/:id/unfollow", Authorization, UserController.unfollow_a_user);
router.put('/change/password', Authorization, SchemaValidation.validateSchema(newPassword), UserController.changePassword);
router.put('/resetPassword/:id', UserController.resetPassword)

// DELETE
router.delete("/delete/:id", Authorization, UserController.deleteUser);

export default router
