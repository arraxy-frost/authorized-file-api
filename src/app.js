import 'dotenv/config';
import express from 'express';
import * as db from "./config/db.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

app.use('/', authRoutes);
app.use('/file', fileRoutes);

app.use(errorHandler);

export {app, db};