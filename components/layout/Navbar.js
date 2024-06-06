import Link from 'next/link';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link legacyBehavior href="/">
            <Button asChild>
              <a className="text-white">Home</a>
            </Button>
          </Link>
        </li>
        <SignedIn>
          <li>
            <Link legacyBehavior href="/dashboard">
              <Button asChild>
                <a className="text-white">Dashboard</a>
              </Button>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/my-qr">
              <Button asChild>
                <a className="text-white">My-QR</a>
              </Button>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/profile">
              <Button asChild>
                <a className="text-white">My-profile</a>
              </Button>
            </Link>
          </li>
          <li>
            <UserButton />
          </li>
        </SignedIn>
        <SignedOut>
          <li>
            <Link legacyBehavior href="/sign-in">
              <Button asChild>
                <a className="text-white">Sign In</a>
              </Button>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/sign-up">
              <Button asChild>
                <a className="text-white">Sign Up</a>
              </Button>
            </Link>
          </li>
        </SignedOut>
      </ul>
    </nav>
  );
};

export default Navbar;
