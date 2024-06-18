"use client"
import React from 'react';

const UseCaseSection = () => {
  return (
    <section className=" py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-brandOrange text-lg font-semibold mb-4">Usage</h2>
        <h3 className="text-3xl font-bold text-center mb-12">How can you use your QR Code and URL?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img src="/usecase1.jpg" alt="Display at your store" className="w-full h-48 object-cover rounded-md mb-4" />
            <h4 className="text-xl font-bold mb-2 text-brandOrange">Display at your store</h4>
            <p className="text-gray-600">Use our QR POP (printed or ordered) to display your QR Code at tables or by the counter for quick and easy menu access.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img src="/usecase2.jpg" alt="Stick on a window" className="w-full h-48 object-cover rounded-md mb-4" />
            <h4 className="text-xl font-bold mb-2 text-brandOrange">Stick on a window</h4>
            <p className="text-gray-600">Use a Window Sticker to allow passers-by to view your shop information - even if you are closed!</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img src="/usecase3.jpg" alt="Add to your Instagram Story" className="w-full h-48 object-cover rounded-md mb-4" />
            <h4 className="text-xl font-bold mb-2 text-brandOrange">Add to your Instagram Story</h4>
            <p className="text-gray-600">Use Instagram's Link feature to add your menu directly to your stories.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img src="/usecase4.jpg" alt="Add to your current menu" className="w-full h-48 object-cover rounded-md mb-4" />
            <h4 className="text-xl font-bold mb-2 text-brandOrange">Add to your current menu</h4>
            <p className="text-gray-600">Our mini QR POP Stickers can be added to your current menu to give customers a digital way to view your products.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
