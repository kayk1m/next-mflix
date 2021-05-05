import { NextApiRequest, NextApiResponse } from 'next';
import withErrorHandler from '@utils/withErrorHandler';
import verifyToken from '@utils/verifyToken';
import connectMongo from '@utils/connectMongo';
import { bakeCookies, clearedCookies } from '@utils/cookie';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('Missing JWT_SECRET.');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const userId = verifyToken(req, res, { optional: true });

    return res.json({ userId });
  }

  const secure = req.headers.referer?.split(':')[0] === 'https';

  if (req.method === 'POST') {
    const { username } = req.body;

    const { db } = await connectMongo();

    await db.collection('user').updateOne(
      { username },
      {
        $push: { history: new Date() },
      },
      { upsert: true },
    );

    const user = await db
      .collection('user')
      .findOne({ username }, { projection: { _id: 1 } });

    res.setHeader('Set-Cookie', bakeCookies(user._id, { secure }));

    return res.status(204).end();
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearedCookies({ secure }));

    return res.status(204).end();
  }
};

export default withErrorHandler(handler);
