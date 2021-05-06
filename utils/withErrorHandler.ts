import { NextApiResponse } from 'next';

export default function withErrorHandler(
  handler: (req: never, res: NextApiResponse) => Promise<void>,
) {
  const wrapper = async (req: never, res: NextApiResponse) => {
    try {
      await handler(req, res);

      if (!res.writableEnded)
        res.status(400).json({ message: 'Check method.' });
    } catch (err) {
      console.error('/api/status - error:', err);

      res.status(res.statusCode || 500).json({
        message: err.message,
      });
    }
  };

  return wrapper;
}
