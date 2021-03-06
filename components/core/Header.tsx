import React, { FC, Fragment } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import cn from 'classnames';
import { mutate } from 'swr';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/solid';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

import Avatar from '@components/ui/Avatar';
import useUser from '@lib/hooks/useUser';
import signout from '@lib/signout';

const MENU_ITEMS = [{ label: 'Dashboard', href: '/' }] as const;

const Header: FC = () => {
  const router = useRouter();
  const { user } = useUser();

  const handleSignOut = React.useCallback(() => {
    if (!user) return;

    signout()
      .then(() => mutate('/api/auth'))
      .catch((err) => {
        console.error('error while signing out. error:', err);
      });
  }, [user]);

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex px-2 lg:px-0">
                <div className="flex-shrink-0 flex items-center">
                  <span className="font-serif text-2xl font-semibold">
                    MFLIX
                  </span>
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                  {MENU_ITEMS.map(({ label, href }) => (
                    <NextLink key={label} href={href}>
                      <a
                        className={cn(
                          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                          router.pathname === href
                            ? 'border-lightBlue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        )}
                      >
                        {label}
                      </a>
                    </NextLink>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="max-w-lg w-full lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-lightBlue-500 focus:border-lightBlue-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:ml-4 lg:flex lg:items-center">
                <button className="flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-4 relative flex-shrink-0">
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="bg-white rounded-full flex text-sm">
                          <span className="sr-only">Open user menu</span>
                          <Avatar size="sm" />
                        </Menu.Button>
                      </div>
                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={cn(
                                  'block px-4 py-2 text-sm text-gray-700',
                                  {
                                    'bg-gray-100': active,
                                  },
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={cn(
                                  'block px-4 py-2 text-sm text-gray-700',
                                  {
                                    'bg-gray-100': active,
                                  },
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={cn(
                                  'block w-full text-left px-4 py-2 text-sm text-gray-700',
                                  {
                                    'bg-gray-100': active,
                                    hidden: !user?.username,
                                  },
                                )}
                                onClick={handleSignOut}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <NextLink href="/signin">
                                <a
                                  className={cn(
                                    'block px-4 py-2 text-sm text-gray-700',
                                    {
                                      'bg-gray-100': active,
                                      hidden: !!user?.username,
                                    },
                                  )}
                                >
                                  Sign in
                                </a>
                              </NextLink>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {MENU_ITEMS.map(({ label, href }) => (
                <NextLink key={`mobile-${label}`} href={href}>
                  <a
                    className={cn(
                      'bg-lightBlue-50 border-lightBlue-500 text-lightBlue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                      router.pathname === href
                        ? 'bg-lightBlue-50 border-lightBlue-500 text-lightBlue-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                    )}
                  >
                    {label}
                  </a>
                </NextLink>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar size="md" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.username ? 'Test User' : 'Signin first.'}
                  </div>
                  {user?.username && (
                    <div className="text-sm font-medium text-gray-500">
                      {user?.username}
                    </div>
                  )}
                </div>
                <button className="ml-auto flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Settings
                </a>
                {user?.username ? (
                  <button
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      signout().then(() => mutate('/api/auth'));
                    }}
                  >
                    Sign out
                  </button>
                ) : (
                  <NextLink href="/signin">
                    <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                      Sign in
                    </a>
                  </NextLink>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
