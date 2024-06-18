"use client";
import React from 'react';
import TypingEffect from '@/components/homepage/TypingEffect';

const HeroSection = () => {
  const texts = ["Cafes", "Restaurants", "Spas", "Sports Centers", "Retailers", "Individuals"];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 mb-6 lg:mb-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brandBlack ml-4">
            For <span className="text-brandOrange relative h-10 inline-flex items-center whitespace-nowrap ml-4">

              <TypingEffect texts={texts} />
            </span>
          </h1>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brandBlack mt-2 ml-4">
            Attract more customers with a Digital Menu!
          </h1>
          <div className="mt-6">
            <button className="bg-brandOrange text-white  py-2 px-4 rounded ml-4" >
              Sign up and start 14 days trial!
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img src="/hero-image3.png" alt="Mobile Menu" className="max-w-xs lg:max-w-md h-auto" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
