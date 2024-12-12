import React from 'react';

const Hero = () => {
  return (
    <div className="bg-blue-100 py-16">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Connect with Mess Contractors
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Bridging the gap between mess contractors, colleges, and corporates. 
          Discover reliable catering solutions tailored to your needs.
        </p>
        <a href="/auth/login" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Hero;
