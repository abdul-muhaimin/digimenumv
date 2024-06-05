import Link from 'next/link';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link legacyBehavior href="/">
            <a className="text-white">Home</a>
          </Link>
        </li>
        <SignedIn>
          <li>
            <Link legacyBehavior href="/dashboard">
              <a className="text-white">Dashboard</a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/my-qr">
              <a className="text-white">My-QR</a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/profile">
              <a className="text-white">My-profile</a>
            </Link>
          </li>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <li>
            <Link legacyBehavior href="/sign-in">
              <a className="text-white">Sign In</a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="/sign-up">
              <a className="text-white">Sign Up</a>
            </Link>
          </li>
        </SignedOut>
      </ul>
    </nav>
  );
};

export default Navbar;
