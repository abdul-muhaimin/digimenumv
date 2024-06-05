import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useUpsertUser = (isLoaded, isSignedIn, user) => {
  const [isCalled, setIsCalled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('useEffect triggered');
    console.log('isLoaded:', isLoaded);
    console.log('isSignedIn:', isSignedIn);
    console.log('user:', user);
    console.log('isCalled:', isCalled);

    if (!isLoaded) {
      console.log('Clerk not fully loaded yet');
      return;
    }
    console.log('Clerk loaded');

    if (!isSignedIn) {
      console.log('User not signed in');
      return;
    }
    console.log('User signed in');

    if (!user) {
      console.log('User data not available');
      return;
    }
    console.log('User data available');

    if (isCalled) {
      console.log('API already called, skipping');
      return;
    }

    const clerkId = user.id;

    const upsertUser = async () => {
      try {
        console.log('Calling API');
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clerkId }),
        });

        if (response.ok) {
          console.log('API call successful');
          setIsCalled(true); // Set flag to true after successful API call
        } else {
          console.error('API call failed', await response.text());
        }
      } catch (error) {
        console.error('Error during API call:', error);
      }
    };

    upsertUser();
  }, [isLoaded, isSignedIn, user, isCalled]);
};
