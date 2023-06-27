// SOCIAL MEDIA TOKEN CONFIG
import jwt from "jsonwebtoken";
import { SECRET } from "../config/keys.mjs";

class Token {
  /**
   * @description - THIS IS USED TO GENERATE A TOKEN
   * @param { object } user - THE USER THE TOKEN IS BEEN GENERATED TO
   * @returns - RETURNS THE GENERATED TOKEN
   * @memberof Token
   */

  static async generateToken(user) {
    const payload = {
      userId: user.id,
      role: user.role,
    };

    const options = {
      expiresIn: "2d",
    };

    try {
      const token = jwt.sign(payload, SECRET, options);
      return token;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default Token;
