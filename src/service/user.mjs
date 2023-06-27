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
      const userExists = await UserModel.findOne({ email });
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
      const user = await UserModel.findOne({ email });
      if (!user)
        return {
          statusCode: 404,
          message: "user not found",
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
        data: user,
        accessToken,
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

      return {
        statusCode: 200,
        message: "user updated successfully",
        data: user,
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
      const options = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
        sort: { createdAt: -1 },
        select: "-password -role -createdAt -updatedAt",
      };

      const search = req.query.search;
      const query = search
        ? { username: { $regex: "search" }, $options: "i" }
        : {};
      const result = await UserModel.paginate(query, options);

      // IF RESULT HAS NEXT PAGE
      const nextPage = result.hasNextPage
        ? `${req.baseUrl}page=${req.nextPage} `
        : null;

      // IF RESULT HAS PREV PAGE
      const prevPage = result.hasPrevPage
        ? `${req.baseUrl}page=${req.nextPage} `
        : null;

      return {
        statusCode: 200,
        message: "fetched all users ",
        data: result.docs,
        nextPage,
        prevPage,
      };
    } catch (err) {
      logger.error(`get_all_user -> Error : ${err.message}`);
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

      const user = await UserModel.findOne({ id }).select(
        "-role -password -createdAt -updatedAt"
      );
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

      HelperFunction.mongooseIdValidator(id);

      if (req.user._id === req.params.id)
        return {
          statusCode: 403,
          message: "you can't follow yourself",
        };

      const user = await UserModel.findById(id);
      if (!user)
        return {
          statusCode: 404,
          message: "user does not exist",
        };

      const currentUser = await UserModel.findById(_id);

      if (!user.followers.includes(currentUser)) {
        await user.updateOne({
          $push: { followers: currentUser },
        });
        await currentUser.updateOne({
          $push: { following: user },
        });

        logger.info(
          `follow_a_user -> Info : user has been followed : ${JSON.stringify(
            user.email
          )}`
        );

        return {
          statusCode: 200,
          message: "user has been followed",
          data: user,
          currentUser,
        };
      } else {
        return {
          statusCode: 400,
          message: "user already followed",
        };
      }
    } catch (err) {
      logger.error(`follow_a_user -> Error : ${err.message}`);
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

      HelperFunction.mongooseIdValidator(id);

      if (req.user._id === req.params.id)
        return {
          statusCode: 403,
          message: "you can't unfollow yourself",
        };

      const user = await UserModel.findById(id);
      if (!user)
        return {
          statusCode: 404,
          message: "user does not exists ",
        };

      const currentUser = await UserModel.findById(_id);

      if (user.followers.includes(currentUser)) {
        await user.updateOne({ $pull: { followers: currentUser } });
        await currentUser.updateOne({ $pull: { followings: user } });

        return {
          statusCode: 200,
          message: "user has been unfollowed",
        };
      } else {
        return {
          statusCode: 406,
          message: "user hasn't been followed",
        };
      }
    } catch (err) {
      logger.error(`unfollow_a_user -> Error : ${err.message}`);
    }
  }
}

export default UserService;
