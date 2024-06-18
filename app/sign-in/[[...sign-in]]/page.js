"use client"
import { SignIn } from '@clerk/nextjs';
import Header from '@/components/homepage/Header';


const SignInPage = () => {


  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex justify-center">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>

      </div>
    </div>
  );
};

export default SignInPage;
