// SOCIAL MEDIA HELPER FUNCTION
import ResponseHelper from "./responseHelper.mjs";
import bcrypt from "bcrypt";
import crypto from "crypto"
import mongoose from 'mongoose'

class HelperFunction {
  /**
   * @description - THIS IS USED TO HASH A PASSWORD
   * @param { string} password - THE PASSWORD TO HASH
   * @returns - RETURNS THE HASHED PASSWORD
   * @memberof HelperFunction
   */
  static async hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
  }

  /**
   * @description - THIS IS USED TO COMPARE A PASSWORD
   * @param { string} password - THE PROVIDED PASSWORD
   * @param { string} hashPassword - THE PASSWORD TO BE COMPARED WITH
   * @returns - RETURNS THE  PASSWORD
   * @memberof HelperFunction
   */
  static async comparePassword(password, hashPassword) {
    return bcrypt.compare(password, hashPassword);
  }

  /**
   * @description - THIS IS USED TO CHECK IF A MONGOOSE ID IS VALID
   * @param {object} id - THE OBJECT ID
   * @memberof HelperFunction
   */
  static async mongooseIdValidator(id) {
    const isValid = mongoose.isValidObjectId(id);

    if (!isValid) throw new Error("invalid mongoose id");
  }

  /**
   * @description - THIS IS USED TO GENERATE A PASSWORD RESET TOKEN
   * @returns - RETURNS A RESET TOKEN
   * @memberof HelperFunction
   */
  static async generatePasswordResetToken() {
    const resetToken = crypto.randomBytes(30).toString("hex");
    this.passwordResetToken = crypto
      .createHash("SHA256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
    return resetToken;
  }

  /**
   * @description - THIS IS USED TO GENERATE A TOKEN
   * @returns - RETURNS A TOKEN
   */
  static async generateResetToken() {
    const resetToken = crypto.randomBytes(32).digest('hex');
    this.passwordResetToken = crypto.createHash('SHA256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiresAt = Date.now() + 10 * 30 * 1000;
    return resetToken
  }


}

export default HelperFunction;
