// SOCIAL MEDIA HELPER FUNCTION
import ResponseHelper from "./responseHelper.mjs";
import bcrypt from "bcrypt";
import crypto from "crypto"
import mongoose from 'mongoose'
import nodemailer from 'nodemailer';
import { MAIL, MAIL_P } from '../config/keys.mjs'

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
  static async generatePasswordResetToken(user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000; // Set expiration to 10 minutes
    await user.save(); // Save the updated user object
    return resetToken;
  }

  static async sendMail(data, req, res) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: MAIL,
        pass: MAIL_P,
      }
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: process.env.MAIL, // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      //
      // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
      //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
      //       <https://github.com/forwardemail/preview-email>
      //
    }

    main().catch(console.error);

  }
}

export default HelperFunction;
