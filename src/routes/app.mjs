// SOCIAL MEDIA APPLICATION
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

const app = express();

// 3RD PARTY MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());
app.use(helmet());

// ROUTES
import userRoutes from "../routes/user.mjs";
import postRoutes from "../routes/post.mjs";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);

export default app;
