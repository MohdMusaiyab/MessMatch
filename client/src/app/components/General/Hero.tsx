import React from 'react';
import { Diamond, ArrowRight, Shield, Star, Award } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-24">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-yellow-600/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Premium icon */}
          <div className="flex justify-center mb-6">
            <Diamond className="text-yellow-500 w-12 h-12" />
          </div>
          
          {/* Main heading with gradient */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-200 text-transparent bg-clip-text">
              Elite Mess Contractor Network
            </span>
          </h1>
          
          {/* Subheading with premium styling */}
          <p className="text-lg md:text-xl text-neutral-300 mb-8 leading-relaxed">
            Connect with premium mess contractors through our exclusive platform. 
            Elevating institutional dining experiences through certified partnerships.
          </p>
          
          {/* CTA buttons with gradient effects */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button className="group px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 rounded-lg flex items-center justify-center transition-all">
              <span className="text-white font-semibold">Get Started</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-yellow-700/50 hover:border-yellow-600 rounded-lg text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
              Learn More
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Shield className="text-yellow-500 w-5 h-5" />
              <span className="text-neutral-300">Verified Contractors</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Star className="text-yellow-500 w-5 h-5" />
              <span className="text-neutral-300">Premium Service</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Award className="text-yellow-500 w-5 h-5" />
              <span className="text-neutral-300">Quality Assured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;