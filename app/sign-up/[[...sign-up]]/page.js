"use client"
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex justify-center">
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;
