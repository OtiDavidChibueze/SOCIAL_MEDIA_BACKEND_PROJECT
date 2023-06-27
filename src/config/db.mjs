// MONGODB CONFIG
import mongoose from "mongoose";
import logger from "../config/logger.mjs";
import { DB } from "../config/keys.mjs";

const connectToDatabase = () => {
  try {
    mongoose.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true });
    logger.info("connected to database");
  } catch (error) {
    logger.error(`connectToDatabase -> Error : ${error.message}`);
  }
};

export default connectToDatabase;
