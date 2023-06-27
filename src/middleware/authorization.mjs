// SOCIAL MEDIA AUTHORIZATION
import jwt from "jsonwebtoken";
import { SECRET } from "../config/keys.mjs";
import ResponseHelper from "../util/responseHelper.mjs";
import logger from "../config/logger.mjs";

// CONFIG
const Authorization = (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    const token = authHeader;

    if (!token) return ResponseHelper.errorResponse(res, 404, "pls login");

    if (token) {
      jwt.verify(
        token,
        SECRET,
        { algorithms: ["HS256"] },
        async (err, decodedToken) => {
          if (err) {
            logger.info(err);

            if (err.name == "TokenExpiredError") {
              // USER MUST BE REDIRECTED TO THE LOGIN PAGE
              return ResponseHelper.errorResponse(
                res,
                400,
                "token expired pls re-login"
              );
            } else {
              // TOKEN HAS ALREADY BEEN TEMPERED WITH
              return ResponseHelper.errorResponse(res, 400, "invalid token");
            }
          } else {
            logger.info(decodedToken);

            req.user = {
              _id: decodedToken.userId,
              role: decodedToken.role,
            };

            if (
              req.user.role === "user" ||
              req.user.role === "isAdmin" ||
              req.user.role === "isSuperAdmin"
            ) {
              return next();
            } else {
              return ResponseHelper.errorResponse(
                res,
                401,
                "Unauthorized Access"
              );
            }
          }
        }
      );
    }
  } catch (err) {
    logger.error(`Authorization -> Error : ${err.message}`);
    return ResponseHelper.errorResponse(res, 500, "Oops something went wrong!");
  }
};

export default Authorization;
