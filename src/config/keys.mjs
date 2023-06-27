import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const DB = process.env.DATABASE;
export const SECRET = process.env.SECRET;

