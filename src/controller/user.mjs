// USER CONTROLLER
import UserService from "../service/user.mjs";
import ResponseHelper from "../util/responseHelper.mjs";
import logger from "../config/logger.mjs";

class UserController {
  /**
   * @description - RETURNS A JSON
   * @param { object } req - THE REQUEST OBJECT
   * @param {object} res - THE RESPONSE OBJECT
   * @returns - RETURNS THE JSON
   * @memberof UserController
   */
  static async signUp(req, res) {
    try {
      const data = req.body;
      const result = await UserService.signUp(data);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(
        `signUp -> Info : registration completed : ${JSON.stringify(
          result.data
        )} `
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`signUp -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong"
      );
    }
  }
  /**
   * @description - RETURNS A JSON
   * @param { object } req - THE REQUEST OBJECT
   * @param {object} res - THE RESPONSE OBJECT
   * @returns - RETURNS THE JSON
   * @memberof UserController
   */
  static async signIn(req, res) {
    try {
      const data = req.body;
      const result = await UserService.signIn(data);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(
        `signIn -> Info : logged in successfully : ${JSON.stringify(
          result.data
        )} `
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`signIn -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong"
      );
    }
  }

  /**
   * @description - RETURNS A JSON
   * @param {object} req - THE REQUEST OBJECT
   * @param {object} res - THE RESPONSE OBJECT
   * @returns - RETURNS THE JSON OBJECT
   * @memberof UserController
   */
  static async updateUserById(req, res) {
    try {

      if (req.user._id === req.params.id && req.user.isAdmin && req.user.isSuperAdmin) {
        const data = req.body;

        const result = await UserService.updateUserById(data, req);

        if (result.statusCode == 409)
          return ResponseHelper.errorResponse(
            res,
            result.statusCode,
            result.message
          );

        logger.info(
          `updateUser -> Info : user updated successfully : ${JSON.stringify(
            result.data
          )} `
        );

        return ResponseHelper.successResponse(
          res,
          result.statusCode,
          result.message,
          result.data
        );
      } else {
        return ResponseHelper.errorResponse(res, 401, 'Unauthorized Access')
      }
    } catch (err) {
      logger.error(`updateUser -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
   * @description - RETURNS A JSON
   * @param {object} req - THE REQUEST OBJECT
   * @param {object} res - THE RESPONSE OBJECT
   * @returns - RETURNS THE JSON MESSAGE
   * @memberof UserService
   */
  static async deleteUser(req, res) {
    try {

      if (req.user._id === req.params.id && req.user.isAdmin && req.user.isSuperAdmin) {
        const data = req.params;

        const result = await UserService.deleteUser(data);

        if (result.statusCode == 406)
          return ResponseHelper.errorResponse(
            res,
            result.statusCode,
            result.message
          );

        logger.info("deleteUser -> Info : account has been deleted } ");

        return ResponseHelper.successResponse(
          res,
          result.statusCode,
          result.message
        );
      } else {
        return ResponseHelper.errorResponse(res, 403, 'you are only allowed to delete your account')
      }
    } catch (err) {
      logger.error(`deleteUser -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
   * @description - RETURNS A JSON
   * @returns - RETURNS THE JSON MESSAGE
   * @memberof UserController
   */
  static async get_all_user(req, res) {
    try {
      const result = await UserService.get_all_user(req);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(`get_all_user -> Info : users fetched : ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`get_all_user -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
   * @description - RETURNS A JSON
   * @returns - RETURNS THE JSON MESSAGE
   * @memberof UserController
   */
  static async get_all_users_counts(req, res) {
    try {

      if (!req.user.isAdmin && !req.user.isSuperAdmin) return ResponseHelper.errorResponse(res, 401, 'Unauthorized Access')

      const result = await UserService.get_all_users_counts();

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message,
          result.data
        );

      logger.info(`get_all_users_counts -> Info : fetched all users counts : ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`get_all_users_counts -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
   * @description - RETURNS A JSON
   * @returns - RETURNS THE JSON MESSAGE
   * @memberof UserController
   */
  static async get_a_user(req, res) {
    try {
      const data = req.params;

      const result = await UserService.get_a_user(data);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(
        `get_a_user -> Info : fetched the user:  ${JSON.stringify(result.data)}`
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`get_a_user -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
   * @description - RETURNS A JSON
   * @param {object} res - THE RESPONSE OBJECT
   * @param {object} req - THE REQUEST OBJECT
   * @returns - RETURNS THE JSON MESSAGE
   * @memberof UserController
   */
  static async follow_a_user(req, res) {
    try {
      if (req.user._id !== req.params.id) {
        const data = req.params;

        const result = await UserService.follow_a_user(data, req);

        if (result.statusCode == 409)
          return ResponseHelper.errorResponse(
            res,
            result.statusCode,
            result.message
          );

        logger.info(
          "UserController_follow_a_user -> Info : user has been followed  "
        );

        return ResponseHelper.successResponse(
          res,
          result.statusCode,
          result.message
        );
      } else {
        return ResponseHelper.errorResponse(
          res,
          401,
          "you can't follow yourself"
        );
      }
    } catch (err) {
      logger.error(`UserController_follow_a_user: Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
   * @description - RETURNS A JSON
   * @param {object} res - THE RESPONSE OBJECT
   * @param {object} req - THE REQUEST OBJECT
   * @returns - RETURNS THE JSON MESSAGE
   * @memberof UserController
   */
  static async unfollow_a_user(req, res) {
    try {
      if (req.user._id !== req.params.id) {
        const data = req.params;

        const result = await UserService.unfollow_a_user(data, req);

        if (result.statusCode == 409)
          return ResponseHelper.errorResponse(
            res,
            result.statusCode,
            result.message
          );

        logger.info(
          "UserController_unfollow_a_user -> Info : user has been unfollowed  "
        );

        return ResponseHelper.successResponse(
          res,
          result.statusCode,
          result.message
        );
      } else {
        return ResponseHelper.errorResponse(
          res,
          400,
          "you can't unfollow yourself"
        );
      }
    } catch (err) {
      console.log('error', err)
      logger.error(`UserController_unfollow_a_user: Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
  * @description - RETURNS A JSON
  * @returns - RETURNS THE JSON MESSAGE
  * @memberof UserController
  */
  static async get_all_admins_and_counts(req, res) {
    try {

      if (!req.user.isAdmin && !req.user.isSuperAdmin) return ResponseHelper.errorResponse(res, 401, 'Unauthorized Access')

      const result = await UserService.get_all_admins_and_counts();

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message,
          result.counts
        );

      logger.info(`get_all_admins_and_counts -> Info : ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`get_all_admins_and_count -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
  * @description - RETURNS A JSON
  * @returns - RETURNS THE JSON MESSAGE
  * @memberof UserController
  */
  static async get_all_superAdmins_and_counts(req, res) {
    try {
      if (!req.user.isSuperAdmin) return ResponseHelper.errorResponse(res, 401, 'Unauthorized Access')

      const result = await UserService.get_all_superAdmins_and_counts();

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message,
        );

      logger.info(`UserController_get_all_superAdmin_and_counts -> Info : Fetched all admins : ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`UserController_get_all_superAdmins_and_counts -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
  * @description - RETURNS A JSON
  * @returns - RETURNS THE JSON MESSAGE
  * @memberof UserController
  */
  static async changePassword(req, res) {
    try {

      const data = req.body

      const result = await UserService.changePassword(data, req);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message,
        );

      logger.info(`UserController_changePassword -> Info : ${JSON.stringify(result.message)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
      );
    } catch (err) {
      logger.error(`UserController_changePassword -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }

  /**
   * @description - RETURNS A JSON
   * @param {object} req - THE OBJECT REQUEST 
   * @param {object} res - THE OBJECT RESPONSE 
   * @returns - RETURNS THE JSON OBJECT
   */
  static async forgottenPassword(req, res) {
    try {

      const DATA = req.body;

      const result = await UserService.forgottenPassword(DATA);

      if (result.statusCode == 409) return ResponseHelper.errorResponse(res, result.statusCode, result.message);

      logger.info(`UserController_forgottenPassword -> Info : a password reset token has been sent to your email : ${JSON.stringify(result.data)}`)

      return ResponseHelper.successResponse(res, result.statusCode, result.message, result.data)

    } catch (err) {
      logger.info(`UserController_forgottenPassword -> Error : ${JSON.stringify(err.message)}`);
      return ResponseHelper.errorResponse(res, 500, 'Oops something went wrong')
    }
  }

  /**
   * @description - RETURNS A JSON
   * @param {object} req - THE OBJECT REQUEST 
   * @param {object} res - THE OBJECT RESPONSE 
   * @returns - RETURNS THE JSON OBJECT
   */
  static async resetPassword(req, res) {
    try {
      const data = req.body

      const result = await UserService.resetPassword(data, req);

      if (result.statusCode == 409) return ResponseHelper.errorResponse(res, result.statusCode, result.message);

      logger.info(`UserController_resetPassword -> Info : ${JSON.stringify(result.message)}`)

      return ResponseHelper.successResponse(res, result.statusCode, result.message);

    } catch (err) {
      logger.error(`UserController_resetPassword -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(res, 500, 'Oops something went wrong!')
    }
  }
}

export default UserController;
