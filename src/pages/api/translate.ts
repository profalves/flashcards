import { NextApiRequest, NextApiResponse } from "next";
import { translate } from "@/services/translateService";
import { logger } from "@/services/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    logger.warn("HTTP method not allowed", { method: req.method });
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { text } = req.body;

  logger.info("Translation request received", { 
    textLength: text?.length || 0 
  });

  const result = await translate({ text });

  if (!result.success) {
    const statusCode = result.statusCode || 500;
    logger.warn("Translation failed", { 
      error: result.error,
      statusCode 
    });
    return res.status(statusCode).json({ error: result.error });
  }

  return res.status(200).json(result.data);
}
