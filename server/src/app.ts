import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { errorMiddleware, rateLimiter } from "./middlewares";
import routes from "./router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));
morgan(":method :url :status :res[content-length] - :response-time ms");

app.use(rateLimiter);
app.use(routes);

app.use(errorMiddleware);

export default app;
