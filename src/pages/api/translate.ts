import { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = "https://t.song.work/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.query;

  try {
    const response = await fetch(`${ENDPOINT}?text=${text}&from=en&to=pt`);
    if (!response.ok) {
      res.status(400).json({ error: response.statusText });
    }
    const data = await response.json();

    if (!data.result) {
      data.result = data.translations.noun[0].translation;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
}
