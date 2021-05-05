export default async function signout(): Promise<void> {
  await fetch('/api/auth', { method: 'DELETE' });
}
