import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

// type ReturnType<T> = T extends false ? string : string | null;

function verifyToken(
  req: NextApiRequest,
  res: NextApiResponse,
  optional?: false,
): string;
function verifyToken(
  req: NextApiRequest,
  res: NextApiResponse,
  optional: true,
): string | null;
function verifyToken(
  req: NextApiRequest,
  res: NextApiResponse,
  optional = false,
): string | null {
  if (!jwtSecret) throw new Error('Missing JWT_SECRET.');
  try {
    const { 'next-mflix-token': token } = req.cookies;

    if (!token) throw new Error('No token on cookies.');

    const { userId } = jwt.verify(token, jwtSecret) as {
      userId: string;
    };

    return userId;
  } catch (err) {
    if (optional) return null;

    res.status(401);
    throw err;
  }
}

// const verifyToken = <T extends boolean | undefined>(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   optional: T = false as T,
// ): ReturnType<T> => {
//   try {
//     const { 'next-mflix-token': token } = req.cookies;

//     if (!token) throw new Error('No token on cookies.');

//     const { userId } = jwt.verify(token, jwtSecret) as {
//       userId: string;
//     };

//     return userId as ReturnType<T>;
//   } catch (err) {
//     if (optional) return null as ReturnType<T>;

//     res.status(401);
//     throw err;
//   }
// };

export default verifyToken;
