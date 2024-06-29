import React from 'react';

const GetStartedSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-6 text-brandBlack">Get Started In 3 Simple Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <img src="/step1.svg" alt="Step 1" className="w-32 h-32 object-cover mb-4" />
            <div className="bg-orange-100 text-brandOrange rounded-full h-12 w-12 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold text-brandBlack mb-2 text-brandOrange">Sign Up</h3>
            <p className="text-gray-600">Registration is simple and quick. It only takes a few minutes!</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="/step3.svg" alt="Step 2" className="w-32 h-32 object-cover mb-4" />
            <div className="bg-orange-100 text-brandOrange rounded-full h-12 w-12 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold text-brandOrange mb-2">Create Mobile Menu</h3>
            <p className="text-gray-600">Mobile menus are easy to make on DIGIMENU. Restaurants, cafes, gift shops, and more can benefit from creating a mobile menu!</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="/step2.svg" alt="Step 3" className="w-32 h-32 object-cover mb-4" />
            <div className="bg-orange-100 text-brandOrange rounded-full h-12 w-12 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold text-brandBlack mb-2 text-brandOrange">Display Your QR Code</h3>
            <p className="text-gray-600">After your menu is created, you will receive a unique QR code and URL. Share these online and in person to attract more customers to your store!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;
