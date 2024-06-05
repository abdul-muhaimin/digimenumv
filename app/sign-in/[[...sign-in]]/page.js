"use client"
import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <SignIn />
      </div>
    </div>
  );
};

export default SignInPage;
