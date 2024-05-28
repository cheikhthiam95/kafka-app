import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body;
    try {
      await axios.post('http://192.168.1.12:3000/kafka/send', { message });
      res.status(200).json({ status: 'Message sent' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        res.status(500).json({ error: 'Failed to send message', details: error.message });
      } else {
        res.status(500).json({ error: 'Failed to send message', details: 'Unknown error' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
