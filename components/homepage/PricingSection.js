import React from 'react';

const PricingSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-6 text-brandBlack">Plans to Match Your Business Needs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="bg-lightBrandOrange p-4 rounded-t-lg">
              <h3 className="text-xl font-bold text-brandBlack mb-2"> 30 Days Trial</h3>
            </div>
            <p className="text-gray-600 mb-4">For businesses just getting started with mobile menus</p>
            <div className="text-3xl font-bold text-brandBlack mb-4">00 Mrf</div>
            <ul className="text-left mb-4">
              <li className="flex items-center mb-2">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Unlimited menu creation
              </li>
              <li className="flex items-center mb-2">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Basic product descriptions
              </li>
              <li className="flex items-center mb-2">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                2 color themes
              </li>
            </ul>
            <a href="#" className="text-orange-600 font-semibold">See all features</a>
            <p className="text-sm text-gray-500 mt-2">*excludes taxes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="bg-lightBrandOrange p-4 rounded-t-lg">
              <h3 className="text-xl font-bold text-brandBlack mb-2">Members</h3>
            </div>
            <p className="text-gray-600 mb-4">For businesses just getting started with mobile menus</p>
            <div className="text-3xl font-bold text-brandBlack mb-4">250 Mrf/ Month</div>
            <ul className="text-left mb-4">
              <li className="flex items-center mb-2">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Unlimited menu creation
              </li>
              <li className="flex items-center mb-2">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Basic product descriptions
              </li>
              <li className="flex items-center mb-2">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                2 color themes
              </li>
            </ul>
            <a href="#" className="text-orange-600 font-semibold">See all features</a>
            <p className="text-sm text-gray-500 mt-2">*excludes taxes</p>
          </div>

          {/* Add more pricing cards here, following the same structure */}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
