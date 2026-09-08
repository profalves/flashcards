import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "@/services/logger";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    logger.warn("HTTP method not allowed", { method: req.method });
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ 
      error: "Field 'text' is required and must be a string." 
    });
  }

  logger.info("Translation request forwarded to backend", { 
    textLength: text.length,
    backendUrl: BACKEND_URL,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${BACKEND_URL}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      // @ts-ignore
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.error("Backend returned error", {
        status: response.status,
        statusText: response.statusText,
      });
      return res.status(response.status).json({ 
        error: `Backend error: ${response.status}` 
      });
    }

    const data = await response.json();

    logger.success("Translation completed", {
      textLength: text.length,
      provider: data.provider,
    });

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        logger.error("Backend request timeout", { timeout: 15000 });
        return res.status(504).json({ 
          error: "Backend timeout. Please try again." 
        });
      }

      logger.error("Error forwarding to backend", {
        errorName: error.name,
        errorMessage: error.message.substring(0, 100),
      });
    }

    res.status(500).json({ 
      error: "Failed to process translation" 
    });
  }
}
