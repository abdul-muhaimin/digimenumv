"use client"
import React from 'react';

const TestimonialSection = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-brandOrange text-lg font-semibold mb-4">Client Testimonies</h2>
        <h3 className="text-2xl font-bold text-center mb-12">Mobile Menus for All Businesses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <img src="/testimonial1.jpg" alt="Testimonial 1" className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold text-brandOrange">Okinawan Cafe and Shop</h3>
            <p className="text-gray-600 mb-4">
              Sakai-san uses scannable QR Codes throughout her shop to make sure customers can access the product information even when she is busy attending to others.
            </p>
            <p className="text-gray-600 italic">Sakai-san - Shop Owner<br />SUGURI Zakka & Nature Café</p>
            <div className="absolute top-2 right-2">
              <img src="/qr-code1.svg" alt="QR Code 1" className="w-12 h-12 object-cover rounded-md" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <img src="/testimonial2.jpg" alt="Testimonial 2" className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold text-brandOrange">Yakitori Izakaya</h3>
            <p className="text-gray-600 mb-4">
              DIGIMENU allows everyone at the table to see the entire menu at once. In addition, since it is paperless, there is no need to replace the menu resulting in a reduction in labor and cost.
            </p>
            <p className="text-gray-600 italic">Yukakate-san - Restaurant Manager<br />Kawaya Gion</p>
            <div className="absolute top-2 right-2">
              <img src="/qr-code1.svg" alt="QR Code 2" className="w-12 h-12 object-cover rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
