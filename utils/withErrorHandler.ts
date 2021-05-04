import { NextApiResponse } from 'next';

const withErrorHandler = async (
  handler: (req: never, res: NextApiResponse) => Promise<void>,
) => {
  const wrapper = async (req: never, res: NextApiResponse) => {
    try {
      await handler(req, res);

      return res.status(404).json({ message: 'Check method.' });
    } catch (err) {
      console.error('/api/status - error:', err);

      return res.status(res.statusCode || 500).json({
        message: err.message,
      });
    }
  };

  return wrapper;
};

export default withErrorHandler;
