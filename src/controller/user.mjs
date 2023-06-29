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
  static async updateUser(req, res) {
    try {
      const data = req.body;

      const result = await UserService.updateUser(data, req);

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

      logger.info(`get_all_user -> Info : ${JSON.stringify(result.data)}`);

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
}

export default UserController;
