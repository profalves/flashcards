import { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = process.env.NEXT_PUBLIC_API_URL;
const FETCH_TIMEOUT = 5000; // 5 segundos

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validação de entrada
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Use POST." });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ 
      error: "Campo 'text' é obrigatório e deve ser uma string." 
    });
  }

  if (text.trim().length === 0) {
    return res.status(400).json({ 
      error: "O texto não pode estar vazio." 
    });
  }

  if (!ENDPOINT) {
    console.error("❌ NEXT_PUBLIC_API_URL não configurada");
    return res.status(500).json({ 
      error: "Configuração do servidor inválida." 
    });
  }

  try {
    console.log(`📤 Enviando tradução para: ${ENDPOINT}/translate`);
    console.log(`📝 Texto: ${text.substring(0, 50)}...`);

    // Criar AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(`${ENDPOINT}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`❌ Erro da API externa: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `API externa retornou erro: ${response.status}` 
      });
    }

    const data = await response.json();

    console.log(`✅ Tradução realizada com sucesso`);
    res.status(200).json(data);

  } catch (error) {
    // Tratamento específico de erros
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error(`⏱️ Timeout: Requisição excedeu ${FETCH_TIMEOUT}ms`);
        return res.status(504).json({ 
          error: `Timeout na requisição. A API externa está muito lenta (>${FETCH_TIMEOUT}ms)` 
        });
      }

      console.error(`❌ Erro na tradução: ${error.message}`);
      return res.status(500).json({ 
        error: `Erro ao processar tradução: ${error.message}` 
      });
    }

    console.error(`❌ Erro desconhecido:`, error);
    res.status(500).json({ 
      error: "Erro desconhecido ao processar a tradução." 
    });
  }
}
