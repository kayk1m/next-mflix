import connectMongo from '@utils/connectMongo';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { client } = await connectMongo();

    return res.json({ status: client.isConnected() });
  } catch (err) {
    console.error('/api/status - error:', err);

    return res.status(res.statusCode || 500).json({
      message: err.message,
    });
  }
};

export default handler;
