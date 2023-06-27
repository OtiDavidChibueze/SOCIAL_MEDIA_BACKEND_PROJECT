// POST SERVICE
import PostModel from "../model/post.mjs";
import HelperFunction from "../util/helperFunction.mjs";
import logger from "../config/logger.mjs";

class PostService {
  /**
   * @description - THIS ENDPOINT ALLOWS USERS TO CREATE POSTS
   * @param {object} data - THE DATA OBJECT
   * @param {object} req - THE REQUEST OBJECT
   * @returns - RETURNS A JSON
   * @memberof PostService
   */
  static async createPost(data, req) {
    try {
      const { userId, desc, img } = data;
 
      const { _id } = req.user;

      const currentUser = await UserModel.findById(_id);

      const newPost = await new PostModel({
        userId: currentUser.id,
        desc,
        img,
      }).save();

      if (!currentUser.posts.includes(newPost.id)) {
        await currentUser.updateOne({ $push: { posts: newPost.id } });

        logger.info(
          `createPost -> Info : post created successfully : ${JSON.stringify(
            currentUser.username
          )}`
        );
        return {
          statusCode: 200,
          message: "post created",
          data: newPost,
        };
      }
    } catch (err) {
      logger.error(`createPost -> Error : ${err.message}`);
    }
  }
  
  /**
   * @description - THIS ENDPOINT ALLOWS USERS TO GET A POSTS BY ID
   * @param {object} data - THE DATA OBJECT
   * @returns - RETURNS A JSON
   * @memberof PostService
   */
  static async get_a_post(data) {
    try {
      const { id } = data;

      HelperFunction.mongooseIdValidator(id);

      const post = await PostModel.findById(id);
      if (!post)
        return {
          statusCode: 404,
          message: "post does not exist",
        };

      logger.info(
        `get_a_post -> Info : post fetched successfully : ${JSON.stringify(
          post
        )}`
      );

      return {
        statusCode: 200,
        message: "post fetched successfully",
        data: post,
      };
    } catch (err) {
      logger.error(`get_a_post -> Error : ${err.message}`);
    }
  }

  /**
   * @description - THIS ENDPOINT IS USED TO GET A USER TIMELINE POSTS
   * @param {object} data - THE OBJECT DATA
   * @returns - RETURNS A JSON 
   * @memberof PostService
   */
  static async get_a_user_timeline_posts(data) {
    try {
      const { id } = data;

      const user = await UserModel.findById(id);
      if (!user)
        return {
          statusCode: 404,
          message: "user does not exists",
        };

      const userPosts = await user.find({ posts });
      if (!userPosts)
        return {
          statusCode: 404,
          message: "no post available",
        };

      logger.info(
        `get_a_user_timeline_posts -> Info :fetched all timeline posts : ${JSON.stringify(
          userPosts
        )}`
      );

      return {
        statusCode: 200,
        message: "fetched all timeline posts",
        data: userPosts,
      };
    } catch (err) {
      logger.error(`get_a_user_timeline_posts -> Error : ${err.message}`);
    }
  }
}

export default PostService;
