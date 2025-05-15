import 'dotenv/config';
import express from 'express';
import * as db from "./config/db.js";
import cors from 'cors';
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors())
app.use(express.json());

app.use('/', authRoutes);
app.use('/file', fileRoutes);

export { app, db };