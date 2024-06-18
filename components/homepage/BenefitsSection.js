"use client"
import React from 'react';

const BenefitsSection = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-brandOrange text-lg font-semibold mb-4">Product Benefits</h2>
        <h3 className="text-3xl font-bold text-center mb-12">Why DIGIMENU?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center text-center md:text-left">
            <img src="/benefit1.svg" alt="QR Code" className="w-3/4 mb-4" />
            <h4 className="text-xl font-bold mb-2 text-brandOrange">A modern deigital menu</h4>
            <p className="text-gray-600">In just a few minutes, set up a mobile menu that can be shared anytime, anywhere. Mobile menus allow businesses to seamlessly share their shop's unique story and important information.</p>
            <a href="#demo" className="text-brandOrange mt-2">Click to see our DEMO Menus</a>
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-8 flex flex-col items-center md:flex-row md:items-start">
              <img src="/benefit2.svg" alt="Save Time and Cut Costs" className="w-1/4 md:w-1/3 mb-4 md:mb-0 md:mr-4" />
              <div>
                <h4 className="text-xl font-bold mb-2 text-brandOrange">Save Time and Cut Costs</h4>
                <p className="text-gray-600">Save costs associated with creating, processing, and printing traditional menus. This also applies when updating products or adding seasonal items. Manage your content digitally and see updates reflected in real time.</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:flex-row md:items-start">
              <img src="/benefit3.svg" alt="Connect With Customers" className="w-1/4 md:w-1/3 mb-4 md:mb-0 md:mr-4" />
              <div>
                <h4 className="text-xl font-bold mb-2 text-brandOrange">Connect With Customers</h4>
                <p className="text-gray-600">Customers can learn about your business through your mobile menu and enjoy features such as photos, currency conversion*, and creating a selection list. Our powerful translation** technology helps reduce the language barrier and attracts more customers.</p>
                <p className="text-sm text-orange-500 mt-2">*Premium Plans only</p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
