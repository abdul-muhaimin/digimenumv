"use client"
import { useEffect } from 'react';
import Header from '@/components/homepage/Header';
import HeroSection from '@/components/homepage/HeroSection';
import TestimonialSection from '@/components/homepage/TestimonialSection';
import UseCaseSection from '@/components/homepage/UseCaseSection';
import GetStartedSection from '@/components/homepage/GetStartedSection';
import BenefitsSection from '@/components/homepage/BenefitsSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import PricingSection from '@/components/homepage/PricingSection';
// import ContactForm from '@/components/homepage/ContactForm';

export default function Home() {
  useEffect(() => {
    console.log('Rendering Home component');
    const sections = ['hero', 'testimonials', 'use-cases', 'get-started', 'benefits', 'features', 'pricing'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        console.log(`Section "${section}" exists.`);
      } else {
        console.error(`Section "${section}" is missing.`);
      }
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section id="hero" className="bg-white py-4">
          <HeroSection />
        </section>
        <section id="testimonials" className="bg-gray-100 py-4">
          <TestimonialSection />
        </section>
        <section id="use-cases" className="bg-white py-4">
          <UseCaseSection />
        </section>
        <section id="get-started" className="bg-gray-100 py-4">
          <GetStartedSection />
        </section>
        <section id="benefits" className="bg-white py-4">
          <BenefitsSection />
        </section>
        <section id="features" className="bg-gray-100 py-4">
          <FeaturesSection />
        </section>
        <section id="pricing" className="bg-white py-4">
          <PricingSection />
        </section>
        {/* <section id="contact" className="bg-gray-100 py-4">
          <ContactForm />
        </section> */}
      </main>
    </div>
  );
}
