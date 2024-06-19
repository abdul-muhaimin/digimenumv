"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    console.log('Menu toggled:', isOpen);
  };

  const handleScroll = (event, id) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      console.log(`Scrolling to: ${id}`);
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error(`Section "${id}" is missing.`);
    }
  };

  return (
    <header className="py-4 shadow sticky top-0 bg-white z-50" style={{ borderBottom: '2px solid #FF8400' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <Link legacyBehavior href="/" passHref>
          <a>
            <img src="/logo2.svg" alt="Logo" className="w-40 cursor-pointer" />
          </a>
        </Link>
        <div className="flex items-center mr-4">
          <nav className="hidden md:flex space-x-4 mr-4">
            <a href="#hero" onClick={(e) => handleScroll(e, 'hero')} className="cursor-pointer text-brandBlack">Home</a>
            <a href="#testimonials" onClick={(e) => handleScroll(e, 'testimonials')} className="cursor-pointer text-brandBlack">Testimonials</a>
            <a href="#use-cases" onClick={(e) => handleScroll(e, 'use-cases')} className="cursor-pointer text-brandBlack">Use Cases</a>
            <a href="#get-started" onClick={(e) => handleScroll(e, 'get-started')} className="cursor-pointer text-brandBlack">Get Started</a>
            <a href="#benefits" onClick={(e) => handleScroll(e, 'benefits')} className="cursor-pointer text-brandBlack">Benefits</a>
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="cursor-pointer text-brandBlack">Features</a>
            <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="cursor-pointer text-brandBlack">Pricing</a>
          </nav>
          <Link legacyBehavior href="/sign-in" passHref>
            <Button className="bg-[#FF8400] text-white hidden md:block">Sign In</Button>
          </Link>
          <button className="md:hidden ml-4" onClick={toggleMenu}>
            {isOpen ? <XIcon className="w-6 h-6 text-brandBlack" /> : <MenuIcon className="w-6 h-6 text-brandBlack" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav className="md:hidden flex flex-col items-center bg-white shadow-lg py-4">
          <a href="#hero" onClick={(e) => handleScroll(e, 'hero')} className="block py-2 px-4 text-brandBlack">Home</a>
          <a href="#testimonials" onClick={(e) => handleScroll(e, 'testimonials')} className="block py-2 px-4 text-brandBlack">Testimonials</a>
          <a href="#use-cases" onClick={(e) => handleScroll(e, 'use-cases')} className="block py-2 px-4 text-brandBlack">Use Cases</a>
          <a href="#get-started" onClick={(e) => handleScroll(e, 'get-started')} className="block py-2 px-4 text-brandBlack">Get Started</a>
          <a href="#benefits" onClick={(e) => handleScroll(e, 'benefits')} className="block py-2 px-4 text-brandBlack">Benefits</a>
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="block py-2 px-4 text-brandBlack">Features</a>
          <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="block py-2 px-4 text-brandBlack">Pricing</a>
          <Link legacyBehavior href="/sign-in" passHref>
            <Button className="bg-[#FF8400] text-white w-full py-2 mt-2">Sign In</Button>
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
