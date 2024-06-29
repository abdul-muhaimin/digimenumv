// useUpsertUser.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useUpsertUser = (isLoaded, isSignedIn, user, additionalData) => {
  const [isUpsertComplete, setIsUpsertComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    const clerkId = user.id;

    const upsertUser = async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clerkId, ...additionalData }),
        });

        if (response.ok) {
          setIsUpsertComplete(true); // Set flag to true after successful API call
        } else {
          console.error('API call failed', await response.text());
        }
      } catch (error) {
        console.error('Error during API call:', error);
      }
    };

    upsertUser();
  }, [isLoaded, isSignedIn, user, additionalData]);

  return isUpsertComplete;
};
