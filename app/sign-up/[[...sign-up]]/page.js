"use client"
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;
