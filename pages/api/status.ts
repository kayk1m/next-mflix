import { NextApiRequest, NextApiResponse } from 'next';
import withErrorHandler from '@utils/withErrorHandler';
import connectMongo from '@utils/connectMongo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { client } = await connectMongo();

    return res.json({ status: client.isConnected() });
  }
};

export default withErrorHandler(handler);
