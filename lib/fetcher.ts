const fetcher: (url: string, init?: RequestInit) => Promise<any> = async (
  url,
  init,
) => {
  const response = await fetch(url, init);

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
};

export default fetcher;
