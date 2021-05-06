export default async function signin(username: string): Promise<void> {
  if (!username) throw new Error('Missing username.');

  await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
}
