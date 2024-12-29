import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h5 className="text-lg font-semibold">Company Name</h5>
            <p className="text-sm">
              © {new Date().getFullYear()} Company Name. All rights reserved.
            </p>
          </div>
          <ul className="flex space-x-4">
            <Link href="/" className="hover:text-gray-400">
              Home
            </Link>
            <Link href="/about" className="hover:text-gray-400">
              About
            </Link>
            <Link href="/services" className="hover:text-gray-400">
              Services
            </Link>
            <Link href="/contact" className="hover:text-gray-400">
              Contact
            </Link>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
