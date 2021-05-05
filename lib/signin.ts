import fetcher from './fetcher';

export default async function signin(username: string): Promise<void> {
  await fetcher('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
}
