// POST CONTROLLER
import PostService from "../service/post.mjs";
import ResponseHelper from "../util/responseHelper.mjs";
import logger from "../config/logger.mjs";

class PostController {
  /**
   * @description - RETURNS A JSON
   * @param {object} req - THE REQUEST OBJECT
   * @param {object} res - THE RESPONSE OBJECT
   * @returns - RETURNS THE JSON OBJECT
   * @memberof PostController
   */
  static async createPost(req, res) {
    try {
      if (req.user.role !== "user")
        return ResponseHelper.errorResponse(res, 401, "Unauthorized Access");

      const data = req.body;

      const result = await PostService.createPost(data, req);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(
        `createPost -> Info : post created successfully : ${JSON.stringify(
          result.data
        )}`
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`createUser -> Error : ${err.message}`);
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
   * @returns - RETURNS THE JSON OBJECT
   * @memberof PostController
   */
  static async get_a_post(req, res) {
    try {
      const data = req.params;

      const result = await PostService.get_a_post(data);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(
        `get_a_post -> Info : post fetched successfully : ${JSON.stringify(
          result.data
        )}`
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`get_a_post -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }
}

export default PostController;
