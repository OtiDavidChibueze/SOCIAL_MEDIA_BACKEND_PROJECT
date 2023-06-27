// RESPONSE HELPER
class ResponseHelper {
  /**
   * @description - THIS IS USED TO SEND A SUCCESS RESPONSE
   * @param { object} res - THE RESPONSE OBJECT
   * @param { number } statusCode - THE STATUSCODE TO BE SENT
   * @param {string} message - THE MESSAGE TO BE SENT
   * @param { object} data - THE DATA TO BE SENT
   * @returns - RETURNS A JSON
   * @memberof ResponseHelper
   */
  static async successResponse(res, statusCode, message, data) {
    return res.status(statusCode).json({ status: "success", message, data });
  }

  /**
   * @description - THIS IS USED TO SEND A ERROR RESPONSE
   * @param { object} res - THE RESPONSE OBJECT
   * @param { number } statusCode - THE STATUSCODE TO BE SENT
   * @param {string} message - THE MESSAGE TO BE SENT
   * @returns - RETURNS A JSON
   * @memberof ResponseHelper
   */
  static async errorResponse(res, statusCode, message) {
    return res.status(statusCode).json({ status: false, message });
  }
}

export default ResponseHelper;
