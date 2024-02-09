import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.query;

  try {
    const response = await fetch(`https://t.song.work/api?text=${text}&from=en&to=pt`);
    if (!response.ok) {
      throw new Error(`Error fetching translation: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
}
