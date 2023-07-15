// SOCIAL MEDIA AUTHORIZATION
import jwt from "jsonwebtoken";
import { SECRET } from "../config/keys.mjs";
import ResponseHelper from "../util/responseHelper.mjs";
import logger from "../config/logger.mjs";

// CONFIG
const Authorization = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.error('Authorization -> Error: no token provided');
      return ResponseHelper.errorResponse(res, 401, "Please login");
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, { algorithms: ["HS256"] }, async (err, decodedToken) => {
      if (err) {
        logger.error(err);

        if (err.name === "TokenExpiredError") {
          logger.error(`Authorization -> Error : Token Expired`)
          return ResponseHelper.errorResponse(res, 400, "Please re-login");
        } else {
          return ResponseHelper.errorResponse(res, 400, "Invalid token");
        }
      } else {
        logger.info(decodedToken);

        req.user = {
          _id: decodedToken.userId,
          isAdmin: decodedToken.isAdmin,
          isSuperAdmin: decodedToken.isSuperAdmin,
        };
        next()
      }
    });
  } catch (err) {
    logger.error(`Authorization -> Error: ${err.message}`);
    return ResponseHelper.errorResponse(res, 500, "Oops, something went wrong!");
  }
};

export default Authorization;
