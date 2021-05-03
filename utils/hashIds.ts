import { ObjectId } from 'bson';
import HashIds from 'hashids';

const key = process.env.HASHIDS_KEY;
if (!key) throw new Error('Missing HASHIDS_KEY');

const hashIds = new HashIds(key);

export const encodeId: (id: string | ObjectId) => string = (id) => {
  return hashIds.encodeHex(String(id));
};

export const decodeId: (hashed: string) => ObjectId = (hashed) => {
  return new ObjectId(hashIds.decodeHex(hashed));
};
