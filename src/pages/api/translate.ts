import { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "";
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("x-apihub-key", API_KEY);
  headers.append("x-apihub-host", API_HOST);
  headers.append("x-apihub-endpoint", API_ENDPOINT);

  try {
    const response = await fetch(
      `${ENDPOINT}?translated_from=eng&translated_to=pt`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      res.status(400).json({ error: response.statusText });
    }
    const data = await response.json();

    console.log("data", data);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
}
