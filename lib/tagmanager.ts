import TagManager from 'react-gtm-module';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
if (!gtmId) throw new Error('Missing NEXT_PUBLIC_GTM_ID.');

interface TagManagerOptions {
  userId?: string;
}

export const initializeTagManager: (
  options?: TagManagerOptions,
) => Promise<void> = async (options) => {
  TagManager.initialize({
    gtmId,
    dataLayer: options,
  });
};
