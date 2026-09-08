import { NextApiRequest, NextApiResponse } from "next";
import { translate } from "@/services/translateService";
import { logger } from "@/services/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validação de método HTTP
  if (req.method !== "POST") {
    logger.warn("Método HTTP não permitido", { method: req.method });
    return res.status(405).json({ error: "Método não permitido. Use POST." });
  }

  const { text } = req.body;

  logger.info("Requisição de tradução recebida", { 
    textLength: text?.length || 0 
  });

  // Chamar serviço de tradução
  const result = await translate({ text });

  if (!result.success) {
    const statusCode = result.statusCode || 500;
    logger.warn("Falha na tradução", { 
      error: result.error,
      statusCode 
    });
    return res.status(statusCode).json({ error: result.error });
  }

  // Sucesso
  return res.status(200).json(result.data);
}
