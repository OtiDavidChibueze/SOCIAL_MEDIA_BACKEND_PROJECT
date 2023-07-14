// USER SERVICE
import UserModel from "../model/user.mjs";
import HelperFunction from "../util/helperFunction.mjs";
import Token from "../util/token.mjs";
import logger from "../config/logger.mjs";
import crypto from 'crypto'

class UserService {

  /**
   * @description - USER SERVICE ENDPOINTS 
   */


  /**
   * @description - THIS ENDPOINT IS USED TO REGISTER A USER
   * @param {object} data - THE OBJECT DATA
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async signUp(data) {
    // getting the data been provided
    const { username, email, password, phone_number } = data;
    try {
      // checking if the user has been registered before
      const userExists = await UserModel.findOne({ email: email });
      if (userExists)
        return {
          statusCode: 406,
          message: "user already exists",
        };

      // checking if the phone number has already been used
      const phoneExists = await UserModel.findOne({ phone_number });
      if (phoneExists)
        return {
          statusCode: 406,
          message: "phone_number already exists",
        };

      // hashing the users password
      const hashPassword = await HelperFunction.hashPassword(password);

      // creating a new user
      const newUser = await new UserModel({
        username,
        email,
        password: hashPassword,
        phone_number,
      }).save();

      // given the new user a access token
      const accessToken = await Token.generateToken(newUser);

      // logging a success message after the the registration is completed
      logger.info(
        `signUp -> Info : registration completed : ${JSON.stringify(email)}`
      );

      // making the create users password undefined so it won't be displayed in the body when its has been sent to the client 
      newUser.password = undefined;

      // return a  success message and the new users credentials 
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
    // getting the data been provided
    const { email, password } = data;
    try {
      // looking for the user with the email been provided
      const user = await UserModel.findOne({ email: email });
      if (!user)
        return {
          statusCode: 404,
          message: "email not registered",
        };

      // checking if its a valid password
      const samePassword = await HelperFunction.comparePassword(
        password,
        user.password
      );
      if (!samePassword)
        return {
          statusCode: 406,
          message: "incorrect password",
        };

      // given the logged in user a access Token
      const accessToken = await Token.generateToken(user);

      // making the password undefined
      user.password = undefined;

      // logging a success response and displaying the logged in user email if all goes well
      logger.info(
        `signIn -> Info : logged in successfully : ${JSON.stringify(
          user.email
        )} `
      );

      // send the response back to the client 
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
  static async updateUserById(data, req) {
    try {
      // getting the user id from the params
      const { id } = req.params;

      // checking if its a valid mongoose id
      await HelperFunction.mongooseIdValidator(id);

      // getting the new details of the user if any is provided
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

      // if the user pass in an existing phone number
      const phoneExists = await UserModel.findOne({ phone_number });
      if (phoneExists)
        return {
          statusCode: 406,
          message: "phone_number already exists",
        };

      // if all goes well update the user credentials
      const user = await UserModel.findByIdAndUpdate(id, data, { new: true });

      // logging out a success response with the updated user name along
      logger.info(
        `updateUser -> Info : user updated successfully : ${JSON.stringify(
          username
        )} `
      );

      // making the password , isAdmin , isSuperAdmin and __v invisible to the client 
      const { password, isAdmin, isSuperAdmin, __v, ...others } = user._doc;

      // return a success response 
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
      // getting the provided id
      const { id } = data;

      // checking if its a valid mongoose id
      await HelperFunction.mongooseIdValidator(id);

      // finding the user with the id provided
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) return {
        statusCode: 404,
        message: 'user not found'
      }

      // return a success response
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
        select: "-password -isAdmin -isSuperAdmin",
      };

      // CREATE A SEARCH BAR QUERY
      const search = req.query.search;
      const query = search ? { username: { $regex: search, $options: "i" } } : {};
      const result = await UserModel.paginate(query, options);



      // IF RESULT HAS NEXT PAGE
      const nextPage = result.hasNextPage
        ? `${req.baseUrl}?page=${req.nextPage}`
        : null;
      // IF RESULT HAS NEXT PAGE
      const prevPage = result.hasPrevPage
        ? `${req.baseUrl}?page=${req.prevPage}`
        : null;


      // RETURNS A SUCCESS RESPONSE
      return {
        statusCode: 200,
        message: "fetched all users ",
        data: {
          result,
          nextPage,
          prevPage,
        }
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
      // getting the provided user id
      const { id } = data;

      // checking if its a valid mongoose id
      await HelperFunction.mongooseIdValidator(id);

      // looking for the user with the provided id
      const user = await UserModel.findById(id).select("-password");
      if (!user)
        return {
          statusCode: 404,
          message: "user does not exist",
        };

      //  logging the user email if  the user is been found
      logger.info(
        `get_a_user -> Info : fetched the user : ${JSON.stringify(user.email)}`
      );

      // returns a success response
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
      // getting the logged in user's id
      const { _id } = req.user;

      // getting the provided user id you want to follow
      const { id } = data;

      // check for valid mongoose ID's
      await HelperFunction.mongooseIdValidator(_id);
      await HelperFunction.mongooseIdValidator(id);

      // get the user
      const user = await UserModel.findById(id);
      if (!user)
        return {
          statusCode: 404,
          message: "user does not exists",
        };

      // get the logged in user
      const currentUser = await UserModel.findById(_id);

      // if the user's follower doesn't includes the logged in user
      if (!user.followers.includes(_id)) {

        // push the logged in user to the user followers
        user.followers.push(_id);
        // increase the user followers counts to 1
        user.followersCount += 1;
        // save the changes
        await user.save();

        // update the logged in user following with the user id
        currentUser.following.push(user.id);
        // increase the logged in user following counts to 1
        currentUser.followingCounts += 1;
        // save the changes
        await currentUser.save();

        // logged out the followed user email 
        logger.info(
          `UserService_follow_a_user -> Info : successfully followed this user : ${JSON.stringify(
            user.email
          )}`
        );

        // returns a success response
        return {
          statusCode: 201,
          message: "successfully followed this user",
        };

      } else { // if the user's followers already includes the logged in user
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
      // getting the logged in user id
      const { _id } = req.user;

      // getting the provided user id you want to unfollow
      const { id } = data;

      // check for valid mongoose ID's
      await HelperFunction.mongooseIdValidator(_id);
      await HelperFunction.mongooseIdValidator(id);

      // get the user
      const user = await UserModel.findById(id);
      if (!user)
        return {
          statusCode: 404,
          message: "user does not exists",
        };

      // getting the logged in user with the _id 
      const currentUser = await UserModel.findById(_id);

      // if the user followers already includes the logged in user
      if (user.followers.includes(_id)) {

        // pull the logged in user _id out
        user.followers.pull(_id);
        // update the user followers count -1
        user.followersCount -= 1;
        // save the changes
        await user.save();

        //pull the user's id from the logged in user's followings
        currentUser.following.pull(user.id);
        // update the user followers count -1
        currentUser.followingCounts -= 1;
        // save the changes
        await currentUser.save();

        // logging out the unfollowed user email
        logger.info(
          `UserService_unfollow_a_user -> Info : successfully unfollowed this user : ${JSON.stringify(
            user.email
          )}`
        );

        // returns a success response
        return {
          statusCode: 201,
          message: "successfully unfollowed this user",
        };

      } else { // if the user's followers doesn't includes the  logged in user _id
        return {
          statusCode: 400,
          message: "You are not following this user.",
        };
      }
    } catch (err) {
      logger.error(`UserService_unfollow_a_user -> Error : ${err.message}`);
    }
  }

  /**
   * @description - THIS ENDPOINT IS USED TO GET ALL ADMINS AND COUNTS
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async get_all_admins_and_counts() {
    // getting the admins from the data base
    const admins = await UserModel.find({ isAdmin: true }).select('-password');

    // getting the counts of the admins
    const counts = admins.length

    // if no admins available
    if (admins.length === 0) return {
      statusCode: 200,
      message: 'no admins available',
      data: { admins: [], counts: 0 }
    }

    // logging out the admins
    logger.info(`UserService_get_all_admins_and_counts -> Info : fetched all admins `);

    // return a success response
    return {
      statusCode: 200,
      message: 'fetched all admins',
      data: { admins, counts }
    }
  }

  /**
   * @description - THIS ENDPOINT IS USED TO GET ALL SUPER ADMINS AND COUNTS
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async get_all_superAdmins_and_counts() {
    // getting all user admins from the database
    const superAdmins = await UserModel.find({ isSuperAdmin: true }).select('-password');

    // getting the super admins count
    const counts = superAdmins.length;

    // if not available super admins
    if (superAdmins.length === 0) {
      return {
        statusCode: 200,
        message: 'No superAdmins available',
        data: { superAdmins: [], counts: 0 }
      };
    }

    // logging out the superAdmins
    logger.info(`UserService_get_all_superAdmins_and_counts -> Info: Fetched all admins`);

    // returns a success response
    return {
      statusCode: 200,
      message: 'Fetched all superAdmins',
      data: { superAdmins, counts }
    };
  }

  /**
   * @description - this is used to get all registered user counts
   * @return - returns a json
   * @memberof UserService
   */
  static async get_all_users_counts() {
    try {
      // get all users from the database
      const users = await UserModel.find({});

      // get the user length and store it inside a variable
      const counts = users.length

      // if on user found ....
      if (users.length === 0) return {
        statusCode: 200,
        message: 'no user found',
        data: { counts: 0 }
      }

      // log the user counts
      logger.info(`userService_get_all_users_counts -> Info : fetched all user counts : ${JSON.stringify(counts)}`)

      // return a json
      return {
        statusCode: 200,
        message: 'fetched all users counts',
        data: { counts }
      }

    } catch (err) {
      logger.error(`userService_get_all_users_counts -> Error : ${err.message}`)
    }
  }

  /**
   * @description - THIS ENDPOINT IS USED TO CHANGE A USER PASSWORD
   * @param {object} data - THE OBJECT DATA
   * @param {object} req - THE OBJECT REQUEST
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async changePassword(data, req) {
    // getting the provided data
    const { newPassword, oldPassword } = data;

    // getting the logged in user _id
    const { _id } = req.user;

    // checking if its a valid mongoose id
    await HelperFunction.mongooseIdValidator(_id)

    // getting the user with the _id
    const currentUser = await UserModel.findById(_id);

    // comparing old password with the logged in user password
    const validOldPassword = await HelperFunction.comparePassword(oldPassword, currentUser.password);

    // if incorrect old password
    if (!validOldPassword) return {
      statusCode: 404,
      message: 'incorrect previous password'
    }

    // if the new password is the same as the old ...
    if (oldPassword === newPassword) return {
      statusCode: 406,
      message: "update your password to a different one , you can't use the same password"
    }

    // generate a password reset token
    await HelperFunction.generatePasswordResetToken(currentUser)

    // hash the password
    const hashPassword = await HelperFunction.hashPassword(newPassword)

    // update the logged in user password
    currentUser.password = hashPassword;

    // save the changes
    await currentUser.save()

    logger.info(`UserService_change_password -> Info : password updated successfully : ${JSON.stringify(currentUser.password)}`)

    // returns a success response
    return {
      statusCode: 201,
      message: 'password updated successfully',
    }
  }

  /**
   * @description - THIS ENDPOINT IS FOR USERS WHO FORGOT THEIR PASSWORD
   * @param {object} DATA - THE OBJECT DATA
   * @returns - RETURNS A JSON
   * @memberof UserService
   */
  static async forgottenPassword(DATA) {
    try {
      // getting the provided email
      const { email } = DATA;

      // searching the user with the email
      const user = await UserModel.findOne({ email });

      // if the user doesn't exists
      if (!user) {
        return {
          statusCode: 404,
          message: "email isn't registered"
        }
      }
      // generate a password reset token
      const resetToken = await HelperFunction.generatePasswordResetToken(user);


      // create a reset url
      const resetUrl = `Hi this link is valid for 10 minutes , please click the link to reset your password <a href =http://localhost:3000/api/v1/user/resetPassword/${resetToken}>click here</a>`
      const data = {
        to: email,
        subject: 'PASSWORD RESET LINK',
        text: 'Your password reset token',
        htm: resetUrl
      }

      // send the mail along with the custom data 
      await HelperFunction.sendMail(data)


      // return a success response
      return {
        statusCode: 200,
        message: 'a password reset token has been sent to your email',
        data: email
      }
    } catch (err) {
      logger.error(`UserService_forgottenPassword -> Error : ${err.message}`);
    }
  }


  /**
   * @description - THIS ENDPOINT IS USED TO RESET A  USER PASSWORD
   * @param {object} data - THE OBJECT DATA
   * @param {object} req - THE OBJECT REQUEST
   * @returns - RETURNS A JSON
   * @memberof UserService  
   */
  static async resetPassword(data, req) {
    try {
      // getting the token id from the params
      const { id } = req.params
      // getting the provided data
      const { newPassword } = data

      // hashing the token id
      const hashToken = crypto.createHash('sha256').update(id).digest('hex');

      // find the user with the token
      const user = await UserModel.findOne({
        passwordResetToken: hashToken,
        passwordResetTokenExpiresAt: { $gt: Date.now() }
      })

      // if the token doesn't exist
      if (!user) {
        return {
          statusCode: 400,
          message: 'token expired , pls try again later'
        }
      }

      // if it does... hash the password
      const hashPassword = await HelperFunction.hashPassword(newPassword);

      // update the user
      user.password = hashPassword;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiresAt = undefined;
      user.passwordChangedAt = Date.now();

      // save the changes
      await user.save()

      // return a success response
      return {
        statusCode: 200,
        message: 'password changed successfully '
      }
    } catch (err) {
      logger.error(`UserService_resetPassword -> Error : ${err.message}`)
    }
  }
}


export default UserService;
