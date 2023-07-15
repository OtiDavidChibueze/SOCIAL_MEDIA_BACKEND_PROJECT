//* POST CONTROLLER
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

      const data = req.body;

      if (req.body.userId !== req.user._id && !req.user._id) return ResponseHelper.errorResponse(res, 401, "Unauthorized Access")

      const result = await PostService.createPost(data, req);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(
        `PostController_createPost -> Info : post created successfully : ${JSON.stringify(
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
      logger.error(`PostController_createPost -> Error : ${err.message}`);
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
  static async get_a_post_by_id(req, res) {
    try {
      const data = req.params;

      const result = await PostService.get_a_post_by_id(data);

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

  /**
   * @description - RETURNS A JSON
   * @param {object} req - THE REQUEST OBJECT
   * @param {object} res - THE RESPONSE OBJECT
   * @returns - RETURNS THE JSON OBJECT
   * @memberof PostController
   */
  static async update_a_post_by_id(req, res) {
    try {
      const data = req.body;

      const result = await PostService.update_a_post_by_id(data, req);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(
        `PostController_update_a_post_by_id -> Info : post updated : ${JSON.stringify(
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
      logger.error(`PostController_update_a_post_by_id -> Error : ${err.message}`);
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
  static async delete_a_post_by_id(req, res) {
    try {
      const data = req.body;

      const result = await PostService.delete_a_post_by_id(data, req);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(`PostController_delete_a_post_by_id -> Info : post deleted`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
      );
    } catch (err) {
      logger.error(`PostController_delete_a_post_by_id -> Error : ${err.message}`);
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
  static async like_a_post_by_id_OR_dislike_a_post_by_id(req, res) {
    try {
      const data = req.params;

      const result = await PostService.like_a_post_by_id_OR_dislike_a_post_by_id(data, req);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(`PostController_like_a_post_by_id -> Info : you like this post : ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`PostController_like_a_post_by_id -> Error : ${err.message}`);
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
  static async get_all_posts_and_followingFriends_posts(req, res) {
    try {
      const data = req.user;

      const result = await PostService.get_all_posts_and_followingFriends_posts(data);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(`PostController_get_all_posts_and_followingFriends_posts -> Info : you like this post : ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`PostController_get_all_posts_and_followingFriends_posts -> Error : ${err.message}`);
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
  static async comment_to_a_post(req, res) {
    try {
      const data = req.body;

      const result = await PostService.comment_to_a_post(data, req);

      if (result.statusCode == 409)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      logger.info(`PostController_comment_to_a_post -> Info : comment sent : ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      logger.error(`PostController_comment_to_a_post -> Error : ${err.message}`);
      return ResponseHelper.errorResponse(
        res,
        500,
        "Oops something went wrong!"
      );
    }
  }


}

export default PostController;
