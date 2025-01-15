"use client";
import React from 'react';
import { motion } from 'framer-motion';

const Services: React.FC = () => {
  const services = [
    {
      title: "Catering Services",
      description: "Our catering services provide delicious meals for any event, from corporate gatherings to weddings. We offer customizable menus to suit your preferences.",
      image: "/api/placeholder/800/500", // Replace with actual image path
      features: ["Custom Menus", "Professional Staff", "Quality Ingredients"]
    },
    {
      title: "Event Planning",
      description: "Let us take care of the details! Our event planning services ensure that your event runs smoothly from start to finish, allowing you to enjoy the occasion.",
      image: "/api/placeholder/800/500", // Replace with actual image path
      features: ["Full Coordination", "Venue Selection", "Timeline Management"]
    },
    {
      title: "Decoration Services",
      description: "We provide stunning decoration services to transform your venue into a beautiful space that reflects your style and theme.",
      image: "/api/placeholder/800/500", // Replace with actual image path
      features: ["Theme Design", "Floral Arrangements", "Lighting Setup"]
    },
    {
      title: "Photography",
      description: "Capture the moments of your special day with our professional photography services. We offer packages that cater to all types of events.",
      image: "/api/placeholder/800/500", // Replace with actual image path
      features: ["Professional Equipment", "Digital Albums", "Print Services"]
    },
    {
      title: "Transportation Services",
      description: "Ensure your guests arrive on time with our reliable transportation services. We provide shuttle services for events of all sizes.",
      image: "/api/placeholder/800/500", // Replace with actual image path
      features: ["Luxury Vehicles", "Professional Drivers", "Custom Routes"]
    },
    {
      title: "Entertainment",
      description: "From live music to DJs, we can provide entertainment options that will keep your guests engaged and having fun throughout the event.",
      image: "/api/placeholder/800/500", // Replace with actual image path
      features: ["Live Bands", "Professional DJs", "Custom Playlists"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[40vh] md:h-[50vh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="/api/placeholder/1920/1080" // Replace with actual hero image
            alt="Services Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 to-neutral-950"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
              Our Premium Services
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl max-w-2xl mx-auto">
              Elevating your events with exceptional service and unparalleled attention to detail
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-16 md:py-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-md bg-neutral-900/30 rounded-xl overflow-hidden border border-yellow-900/20 shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent"></div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-yellow-500">
                  {service.title}
                </h2>
                <p className="text-neutral-300 mb-4">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-neutral-400">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <div className="backdrop-blur-md bg-neutral-900/30 rounded-xl p-8 border border-yellow-900/20 shadow-xl text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-yellow-500">
            Ready to Create Something Extraordinary?
          </h3>
          <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
            Let us help you bring your vision to life. Contact us today to discuss your event needs and discover how we can make your special day truly unforgettable.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-100 rounded-lg font-medium transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 shadow-lg">
            Contact Us
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Services;