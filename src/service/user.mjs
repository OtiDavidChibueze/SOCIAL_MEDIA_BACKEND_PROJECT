// USER SERVICE
import UserModel from "../model/user.mjs";
import HelperFunction from "../util/helperFunction.mjs";
import Token from "../util/token.mjs";
import logger from "../config/logger.mjs";

class UserService {
  /**
   * @description - THIS ENDPOINT IS USED TO REGISTER A USER
   * @param {object} data - THE OBJECT DATA
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async signUp(data) {
    const { username, email, password, phone_number } = data;
    try {
      const userExists = await UserModel.findOne({ email: email });
      if (userExists)
        return {
          statusCode: 406,
          message: "user already exists",
        };

      const phoneExists = await UserModel.findOne({ phone_number });
      if (phoneExists)
        return {
          statusCode: 406,
          message: "phone_number already exists",
        };

      const hashPassword = await HelperFunction.hashPassword(password);

      const newUser = await new UserModel({
        username,
        email,
        password: hashPassword,
        phone_number,
      }).save();

      const accessToken = await Token.generateToken(newUser);

      logger.info(
        `signUp -> Info : registration completed : ${JSON.stringify(email)}`
      );

      newUser.password = undefined;

      return {
        statusCode: 200,
        message: "registration completed pls login",
        data: { newUser, accessToken },
      };
    } catch (err) {
      logger.error(`signUp -> Error : ${err.message}`);
    }
  }

  /**
   * @description - THIS ENDPOINT IS USED TO LOGIN IN USERS
   * @param { object } data - THE OBJECT DATA
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async signIn(data) {
    const { email, password } = data;
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user)
        return {
          statusCode: 404,
          message: "email not registered",
        };

      const oldPassword = await HelperFunction.comparePassword(
        password,
        user.password
      );
      if (!oldPassword)
        return {
          statusCode: 406,
          message: "incorrect password",
        };

      const accessToken = await Token.generateToken(user);

      user.password = undefined;

      logger.info(
        `signIn -> Info : logged in successfully : ${JSON.stringify(
          user.email
        )} `
      );

      return {
        statusCode: 200,
        message: "logged in successfully",
        data: {
          user,
          accessToken,
        },
      };
    } catch (err) {
      logger.error(`signIn -> Error : ${err.message}`);
    }
  }

  /**
   * @description - THIS IS USED TO UPDATE A USER
   * @param {object} data - THE OBJECT DATA
   * @param {object} req - THE REQUEST OBJECT
   * @return - RETURN A JSON
   * @memberof UserService
   */
  static async updateUser(data, req) {
    try {
      const { id } = req.params;

      HelperFunction.mongooseIdValidator(id);

      const {
        username,
        phone_number,
        profile_pics,
        cover_pics,
        desc,
        city,
        from,
        relationship,
      } = data;

      const phoneExists = await UserModel.findOne({ phone_number });
      if (phoneExists)
        return {
          statusCode: 406,
          message: "phone_number already exists",
        };

      const user = await UserModel.findByIdAndUpdate(id, data, { new: true });

      logger.info(
        `updateUser -> Info : user updated successfully : ${JSON.stringify(
          username
        )} `
      );

      const { password, isAdmin, isSuperAdmin, __v, ...others } = user._doc;

      return {
        statusCode: 200,
        message: "user updated successfully",
        data: others,
      };
    } catch (err) {
      logger.error(`updateUser -> Error : ${err.message}`);
    }
  }
  /**
   * @description - THIS ENDPOINT IS USED TO DELETE USER
   * @param {object} data - THE OBJECT DATA
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async deleteUser(data) {
    try {
      const { id } = data;

      HelperFunction.mongooseIdValidator(id);

      const user = await UserModel.findByIdAndDelete(id);

      return {
        statusCode: 200,
        message: "account has been deleted",
      };
    } catch (err) {
      logger.info(`deleteUser -> Error : ${err.message}`);
    }
  }

  /**
   * @description - THIS ENDPOINT IS USED TO GET ALL USERS\
   * @param {object} req - THE REQUEST OBJECT
   * @returns - RETURNS A JSON OBJECT
   * @memberof UserService
   */
  static async get_all_user(req) {
    try {
      // CREATE A QUERY OPTIONS
      const options = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
        sort: { createdAt: -1 },
        select: "-password",
      };

      // CREATE A SEARCH BAR QUERY
      const search = req.query.search;
      const query = search
        ? { username: { $regex: search, $options: "i" } }
        : {};
      const result = await UserModel.paginate(query, options);

      // IF RESULT HAS NEXT PAGE
      const nextPage = result.hasNextPage
        ? `${req.baseUrl}?page=${req.nextPage}`
        : null;
      // IF RESULT HAS NEXT PAGE
      const prevPage = result.hasPrevPage
        ? `${req.baseUrl}?page=${req.prevPage}`
        : null;

      return {
        statusCode: 200,
        message: "fetched all users ",
        data: result.docs,
        nextPage,
        prevPage,
      };
    } catch (err) {
      return logger.error(`get_all_user -> Error : ${err.message}`);
    }
  }

  /**
   * @description - THIS ENDPOINT IS USED TO GET A USERS
   * @param {object} data - THE DATA OBJECT
   * @returns - RETURNS A JSON OBJECT
   * @memberof UserService
   */
  static async get_a_user(data) {
    try {
      const { id } = data;

      HelperFunction.mongooseIdValidator(id);

      const user = await UserModel.findById(id).select("-password");
      if (!user)
        return {
          statusCode: 404,
          message: "user does not exist",
        };

      logger.info(
        `get_a_user -> Info : fetched the user : ${JSON.stringify(user.email)}`
      );

      return {
        statusCode: 200,
        message: "fetched user",
        data: user,
      };
    } catch (err) {
      logger.error(`get_a_user -> Error : ${err.message}`);
    }
  }

  /**
   * @description - THIS ENDPOINT IS USED TO FOLLOW A USER
   * @param {object} data - THE DATA OBJECT
   * @param {object} req - THE REQUEST OBJECT
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async follow_a_user(data, req) {
    try {
      const { _id } = req.user;
      const { id } = data;
      // check for valid mongoose ID's
      HelperFunction.mongooseIdValidator(_id);
      HelperFunction.mongooseIdValidator(id);

      // get the user
      const user = await UserModel.findById(id);
      // get the logged in user
      const currentUser = await UserModel.findById(_id);

      // if the user has not been followed
      if (!user)
        return {
          statusCode: 404,
          message: "user does not exists",
        };

      if (!user.followers.includes(_id)) {

        user.followers.push(_id);
        user.followersCount += 1;
        await user.save();
        currentUser.following.push(user.id);
        currentUser.followingCounts += 1;
        await currentUser.save();

        logger.info(
          `UserService_follow_a_user -> Info : successfully followed this user : ${JSON.stringify(
            user.email
          )}`
        );

        return {
          statusCode: 201,
          message: "successfully followed this user",
        };

      } else {
        return {
          statusCode: 400,
          message: "You already follow this person.",
        };
      }
    } catch (err) {
      logger.error(`UserService_follow_a_user -> Error : ${err.message}`);
    }
  }

  /**
   * @description - THIS ENDPOINT IS USED TO UN_FOLLOW A USER
   * @param {object} data - THE DATA OBJECT
   * @param {object} req - THE REQUEST OBJECT
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async unfollow_a_user(data, req) {
    try {
      const { _id } = req.user;
      const { id } = data;
      // check for valid mongoose ID's
      HelperFunction.mongooseIdValidator(_id);
      HelperFunction.mongooseIdValidator(id);

      // get the user
      const user = await UserModel.findById(id);
      if (!user)
        return {
          statusCode: 404,
          message: "user does not exists",
        };

      const currentUser = await UserModel.findById(_id);

      if (user.followers.includes(_id)) {

        user.followers.pull(_id);
        user.followersCount -= 1;
        await user.save();
        currentUser.following.pull(user.id);
        currentUser.followingCounts -= 1;
        await currentUser.save();

        logger.info(
          `UserService_unfollow_a_user -> Info : successfully unfollowed this user : ${JSON.stringify(
            user.email
          )}`
        );

        return {
          statusCode: 201,
          message: "successfully unfollowed this user",
        };

      } else {
        return {
          statusCode: 400,
          message: "You are not following this user.",
        };
      }
    } catch (err) {
      logger.error(`UserService_unfollow_a_user -> Error : ${err.message}`);
    }
  }
}


export default UserService;
