import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'HEAD' || req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'KaayJob Frontend - OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } else {
    res.setHeader('Allow', 'GET, HEAD');
    res.status(405).json({ error: 'Method not allowed' });
  }
}