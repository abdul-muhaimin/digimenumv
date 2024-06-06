"use client"
import Link from 'next/link';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link href="/" legacyBehavior>
            <a className="text-white">My App</a>
          </Link>
        </div>
        <div className="flex flex-wrap items-center space-x-2 lg:space-x-4 mt-2 lg:mt-0">
          <SignedIn>
            <Link legacyBehavior href="/dashboard">
              <a className={cn("text-white", "text-sm lg:text-base")}>Dashboard</a>
            </Link>
            <Link legacyBehavior href="/my-qr">
              <a className={cn("text-white", "text-sm lg:text-base")}>My-QR</a>
            </Link>
            <Link legacyBehavior href="/profile">
              <a className={cn("text-white", "text-sm lg:text-base")}>My-profile</a>
            </Link>
            <UserButton className="ml-2 lg:ml-4" />
          </SignedIn>
          <SignedOut>
            <Link legacyBehavior href="/sign-in">
              <a className={cn("text-white", "text-sm lg:text-base")}>Sign In</a>
            </Link>
            <Link legacyBehavior href="/sign-up">
              <a className={cn("text-white", "text-sm lg:text-base")}>Sign Up</a>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
