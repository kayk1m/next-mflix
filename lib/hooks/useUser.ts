import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

interface UseUserOptions {
  redirectTo: string;
  redirectAs: string;
  redirectIfFound: boolean;
}

export declare interface UserInfo {
  username: string;
}

export default function useUser(options: Partial<UseUserOptions> = {}) {
  const { redirectTo, redirectIfFound, redirectAs } = options;
  const router = useRouter();

  const { data: user, mutate } = useSWR<UserInfo>('/api/auth', {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (user === undefined) return;

    if (!user?.username && redirectTo && !redirectIfFound) {
      router.replace(redirectTo, redirectAs);
    } else if (user?.username && redirectIfFound) {
      router.replace(redirectTo ?? '/', redirectAs);
    }
  }, [router, user, redirectTo, redirectAs, redirectIfFound]);

  if (user === undefined) {
    return {
      loading: true,
      mutate,
    };
  }

  return {
    loading: false,
    user,
    mutate,
  };
}
