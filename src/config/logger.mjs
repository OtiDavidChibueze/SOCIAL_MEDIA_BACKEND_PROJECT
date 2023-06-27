// LOGGER CONFIG
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  format: format.combine(
    format.json(),
    format.errors({ stack: true }),
    format.timestamp({ format: "ddd , DD MMM YYYY HH:mm:ss [GTM]" }),
    format.splat(),

    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] - [${level.toUpperCase()}] - ${message}`;
    })
  ),

  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({ filename: "appDevelopmentLog.log" }),
  ],

  exceptionHandlers: [
    new transports.File({ filename: "exceptionDevelopmentLog.log" }),
  ],
  exitOnError: false,
});

export default logger;
