import { ObjectId } from 'bson';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('Missing JWT_SECRET');

interface CookieOptions {
  secure: boolean;
}

export const bakeCookies: (
  userId: ObjectId,
  cookieOptions: CookieOptions,
) => string[] = (userId, { secure }) => {
  const token = jwt.sign({ userId }, jwtSecret);

  return [
    serialize('next-mflix-token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure,
    }),
  ];
};

export const clearedCookies: (cookieOptions: CookieOptions) => string[] = ({
  secure,
}) => {
  return [
    serialize('next-mflix-token', '', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure,
    }),
  ];
};
