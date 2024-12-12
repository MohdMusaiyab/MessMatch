import React from 'react';

const Features = () => {
  const featureList = [
    {
      title: 'Easy Connections',
      description: 'Seamlessly connect with mess contractors who meet your specific requirements.',
      icon: '🔗', // You can replace this with an SVG or an image
    },
    {
      title: 'Customizable Menus',
      description: 'Create and customize meal plans that cater to diverse dietary needs.',
      icon: '🍽️',
    },
    {
      title: 'Reliable Service',
      description: 'Enjoy dependable service from vetted contractors with positive reviews.',
      icon: '✅',
    },
    {
      title: 'Cost-Effective Solutions',
      description: 'Find competitive pricing options that fit your budget without compromising quality.',
      icon: '💰',
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureList.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
