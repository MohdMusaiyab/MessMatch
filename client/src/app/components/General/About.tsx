import React from "react";

const About = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
        <p className="text-lg text-gray-600 mb-8">
          We are dedicated to bridging the gap between mess contractors and
          educational institutions as well as corporate clients. Our platform
          facilitates seamless connections, ensuring that everyone has access to
          quality catering services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To provide a reliable and efficient platform that connects mess
              contractors with colleges and corporates, ensuring high-quality
              catering solutions tailored to diverse needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To be the leading platform in the catering industry, recognized
              for our commitment to quality, reliability, and customer
              satisfaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
