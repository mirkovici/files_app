import cors from "cors";
import express, { Express } from "express";
import pino from "pino";
import { fileRouter } from "@/api/files/fileRouter";
import errorHandler from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";

const logger = pino({ name: "server start" });
const app: Express = express();

// Middlewares

// App can only be used from CORS ORIGIN (abstact client)
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// Request logging
app.use(requestLogger);

// Routes
app.use("/api/", fileRouter);
// Error handlers
app.use(errorHandler());

export { app, logger };
