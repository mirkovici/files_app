import cors from "cors";
import express, { Express } from "express";
import pino from "pino";
import { fileRouter } from "@/api/files/fileRouter";
import errorHandler from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(cors());

// Request logging
app.use(requestLogger);

// Routes
app.use("/api/", fileRouter);
// Error handlers
app.use(errorHandler());

export { app, logger };
