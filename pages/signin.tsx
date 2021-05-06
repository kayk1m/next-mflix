import React, { useState } from 'react';
import { mutate } from 'swr';
import { LockClosedIcon } from '@heroicons/react/outline';

import Input from '@components/ui/Input';
import useUser from '@lib/hooks/useUser';
import signin from '@lib/signin';

const SigninPage = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const { loading: userLoading } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  });

  const handleSignin = React.useCallback((username: string) => {
    setLoading(true);
    signin(username)
      .then(async () => {
        await mutate('/api/auth');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lightBlue-600 hover:bg-lightBlue-700"
              disabled={loading || userLoading}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSignin(username);
              }}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-lightBlue-500 group-hover:text-lightBlue-400"
                  aria-hidden="true"
                />
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninPage;
