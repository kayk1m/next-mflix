import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('Missing JWT_SECRET.');

// function verifyToken(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   optional?: false,
// ): string;
// function verifyToken(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   optional: true,
// ): string | null;
// function verifyToken(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   optional = false,
// ): string | null {
//   if (!jwtSecret) throw new Error('Missing JWT_SECRET.');
//   try {
//     const { 'next-mflix-token': token } = req.cookies;

//     if (!token) throw new Error('No token on cookies.');

//     const { userId } = jwt.verify(token, jwtSecret) as {
//       userId: string;
//     };

//     return userId;
//   } catch (err) {
//     if (optional) return null;

//     res.status(401);
//     throw err;
//   }
// }

type ReturnType<T> = T extends { optional: true } ? string | null : string;

const verifyToken = <T extends { optional: boolean }>(
  req: NextApiRequest,
  res: NextApiResponse,
  opts?: T,
): ReturnType<T> => {
  const options = opts ?? { optional: false };
  try {
    const { 'next-mflix-token': token } = req.cookies;

    if (!token) throw new Error('No token on cookies.');

    const { userId } = jwt.verify(token, jwtSecret) as {
      userId: string;
    };

    return userId as ReturnType<T>;
  } catch (err) {
    if (options.optional) return null as ReturnType<T>;

    res.status(401);
    throw err;
  }
};

export default verifyToken;
