//* POST SERVICE
import PostModel from "../model/post.mjs";
import HelperFunction from "../util/helperFunction.mjs";
import logger from "../config/logger.mjs";
import UserModel from '../model/user.mjs'

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
      // getting the provided details from the data
      const { userId, desc, img } = data;

      // getting the logged in user id
      const { _id } = req.user;

      // checking if its a valid mongoose _id for the current user 
      await HelperFunction.mongooseIdValidator(_id)

      // getting the logged in currentUser _id 
      const currentUser = await UserModel.findById(_id);

      // creating a new post
      const newPost = await new PostModel({
        userId: currentUser.id,
        desc,
        img,
      }).save();

      // if (!currentUser.posts.includes(newPost.id)) {
      //   await currentUser.updateOne({ $push: { posts: newPost.id } });

      // logging out the currentUser name to the terminal
      logger.info(
        `PostService_createPost -> Info : post created successfully : ${JSON.stringify(
          currentUser.username
        )}`
      );

      // sending a success response
      return {
        statusCode: 200,
        message: "post created",
        data: { newPost },
      };

    } catch (err) {
      logger.error(`PostService_createPost -> Error : ${err.message}`);
    }
  }

  /**
   * @description - THIS ENDPOINT ALLOWS USERS TO GET A POSTS BY ID
   * @param {object} data - THE DATA OBJECT
   * @returns - RETURNS A JSON
   * @memberof PostService
   */
  static async get_a_post_by_id(data) {
    try {
      // getting the details from the data
      const { id } = data;

      // checking if its a valid mongoose id
      await HelperFunction.mongooseIdValidator(id);

      // getting the post with the provided id
      const post = await PostModel.findById(id);
      // if the post didn't exists
      if (!post)
        return {
          statusCode: 404,
          message: "post does not exist",
        };

      // log the post  to the terminal
      logger.info(
        `get_a_post -> Info : post fetched successfully : ${JSON.stringify(
          post
        )}`
      );

      // return a success response
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
   * @description - this endpoint is used to update a user's post by id
   * @param {object} data - the object data
   * @param {object} req - the object request
   * @returns - returns a json 
   * @memberof PostService  
   */
  static async update_a_post_by_id(data, req) {
    try {
      // getting the details from the data
      const { desc, img, video } = data

      // getting the post id
      const { id } = req.params;

      // checking if its a valid mongoose id
      await HelperFunction.mongooseIdValidator(id);

      // fetching the post with the provided id
      const post = await PostModel.findById(id);
      // if the post doesn't exists
      if (!post) return {
        statusCode: 404,
        message: 'post not found'
      }

      // if the post user isn't the same as the logged in user or the current user isn't an admin or superAdmin
      if (post.userId !== req.user._id && !req.user.isAdmin && !req.user.isSuperAdmin) return {
        statusCode: 401,
        message: "you're allowed to update only your post"
      }

      // update the post
      await PostModel.findByIdAndUpdate(id, data, { new: true });

      // save the changes
      await post.save();

      // logging out the post to the terminal
      logger.info(`PostService_update_a_post_by_id -> Info : update successfully : ${JSON.stringify(post)}`)

      // return a success response
      return {
        statusCode: 200,
        message: 'update successfully',
        data: { post }
      }
    } catch (error) {
      logger.error(`PostService_update_a_post_by_id -> Error : ${err.message}`)
    }
  }

  /**
  * @description - this endpoint is used to delete a user's post by id
  * @param {object} data - the object data
  * @param {object} req - the object request
  * @returns - returns a json 
  * @memberof PostService  
  */
  static async delete_a_post_by_id(data, req) {
    try {
      // getting the post id
      const { id } = data;

      // checking if its a valid mongoose id
      await HelperFunction.mongooseIdValidator(id);

      // fetching the post with the provided id
      const post = await PostModel.findById(id);
      // if the post doesn't exists
      if (!post) return {
        statusCode: 404,
        message: 'post not found'
      }

      // if the post owner isn't the actual owner or isn't an admin or superAdmin
      if (post.userId !== req.user._id && !req.user.isAdmin && !req.user.isSuperAdmin) return {
        statusCode: 401,
        message: "you're allowed to delete only your post"
      }

      // delete the post with the provided id
      await PostModel.findByIdAndDelete(id);

      // logging out the post to the terminal
      logger.info(`PostService_delete_a_post_by_id -> Info : delete successfully `)

      // return a success response
      return {
        statusCode: 200,
        message: 'delete successfully',
      }
    } catch (error) {
      logger.error(`PostService_delete_a_post_by_id -> Error : ${err.message}`)
    }
  }

  /**
* @description - this endpoint is used to like a user's post by id
* @param {object} data - the object data
* @returns - returns a json 
* @memberof PostService  
*/
  static async like_a_post_by_id_OR_dislike_a_post_by_id(data, req) {
    try {
      // getting the id from the data
      const { id } = data

      // getting the _id of the logged in user
      const { _id } = req.user

      // checking if its a valid mongoose id
      await HelperFunction.mongooseIdValidator(id)
      await HelperFunction.mongooseIdValidator(_id)

      // fetching the post with the provided id
      const post = await PostModel.findById(id);
      // if the post doesn't exist
      if (!post) return {
        statusCode: 404,
        message: 'post not found'
      };

      // checking if the post hasn't been liked already
      if (!post.liked.includes(_id)) {

        // update the post like
        post.liked.push(_id);
        post.like += 1

        // update the post dislike
        post.disliked.pull(_id);
        post.dislike -= 1

        //  save the changes
        await post.save();

        // return a json message
        return {
          statusCode: 200,
          message: 'you like this post',
          data: { post }
        }

      } else {
        // update the post dislike
        post.disliked.push(_id);
        post.dislike += 1
        // update the post like
        post.liked.pull(_id);
        post.like -= 1

        // save the changes
        await post.save();

        // return a json message  
        return {
          statusCode: 200,
          message: 'you dislike this post',
          data: { post }
        }
      }

    } catch (error) {
      logger.error(`PostService_like_a_post_by_id_OR_dislike_a_post_by_id -> Error : ${error.message}`)
    }

  }


  /**
   * @description - this endpoint is  used to get a user timeline posts
   * @param {object} data - the object data
   * @returns - returns a json 
   * @memberof PostService
   */
  static async get_all_posts_and_followingFriends_posts(data) {
    try {
      // fetching the logged in user _id
      const { _id } = data;

      await HelperFunction.mongooseIdValidator(_id)

      // fetching the logged in user posts
      const loggedInUser = await UserModel.findById(_id);
      const loggedInUserPosts = await PostModel.find({ userId: loggedInUser.id })

      // fetching the logged in user all following friends posts
      const followingFriendsPosts = await Promise.all(
        loggedInUser.following.map((friendsId) => {
          return PostModel.find({ userId: friendsId })
        })
      )

      // concat the logged in user posts and following friends posts 
      const allPosts = loggedInUserPosts.concat(...followingFriendsPosts);

      // sort the posts in an ascending order
      allPosts.sort((a, b) => b.createdAt - a.createdAt);


      // returning a json message
      return {
        statusCode: 200,
        message: "fetched all timeline posts",
        data: { timeline: allPosts },
      };
    } catch (err) {
      logger.error(`PostService_get_all_posts_and_followingFriends_posts -> Error : ${err.message}`);
    }
  }


  static async comment_to_a_post(data, req) {

    try {
      // getting the post id from the data
      const { comment, postId } = data;

      // getting the logged in user 
      const { _id } = req.user;

      // checking if its a valid mongoose id
      await HelperFunction.mongooseIdValidator(postId);
      await HelperFunction.mongooseIdValidator(_id);

      // fetching the post with the provided id
      const post = await PostModel.findById(postId);
      // if the post doesn't exist
      if (!post) {
        return {
          statusCode: 404,
          message: 'post not found'
        }
      } else {
        // update the post
        await post.updateOne({ $push: { comments: { commentedBy: _id, comment: comment } } });

        //* save the changes
        await post.save();

        // return a json message 
        return {
          statusCode: 200,
          message: 'comment sent',
          data: { post }
        }
      }
    } catch (error) {
      logger.error(`PostService_comment_to_a_post -> Error : ${error.message}`);
    }
  }
}

export default PostService;
