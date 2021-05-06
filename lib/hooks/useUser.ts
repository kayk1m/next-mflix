import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

interface UseUserOptions {
  redirectTo: string;
  redirectAs: string;
  redirectIfFound: boolean;
}

export declare interface UserInfo {
  userId: string;
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

    if (!user?.userId && redirectTo && !redirectIfFound) {
      router.replace(redirectTo, redirectAs);
    } else if (user?.userId && redirectIfFound) {
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
