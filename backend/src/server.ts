import express, { Express, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { logger } from "./logger.js";
import { translate, validateTranslateInput } from "./translateService.js";

config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://flashcards-murex-one.vercel.app",
      process.env.FRONTEND_URL || "*",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use((req: Request, res: Response, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent")?.substring(0, 50),
  });
  next();
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.post("/api/translate", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      logger.warn("Missing text in request");
      return res.status(400).json({
        error: "Field 'text' is required",
      });
    }

    const result = await translate({ text });

    if (!result.success) {
      const statusCode = result.statusCode || 500;
      logger.warn("Translation failed", {
        error: result.error,
        statusCode,
      });
      return res.status(statusCode).json({
        error: result.error,
      });
    }

    logger.success("Translation request successful", {
      textLength: text.length,
      provider: result.data?.provider,
    });

    res.status(200).json(result.data);
  } catch (error) {
    logger.error("Unexpected error in translate endpoint", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Flashcards Translation API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      translate: "POST /api/translate",
    },
  });
});

app.use((req: Request, res: Response) => {
  logger.warn("Route not found", { path: req.path, method: req.method });
  res.status(404).json({
    error: "Not found",
  });
});

app.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});
