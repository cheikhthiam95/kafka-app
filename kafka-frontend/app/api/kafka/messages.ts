import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get('http://192.168.1.12:3000/kafka/messages');
      res.status(200).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch messages', details: 'Unknown error' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
