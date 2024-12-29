"use client";
import React from 'react';

const Services: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>
      <p className="mb-4">
        We offer a variety of services to meet your needs. Explore our offerings below:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Service Card 1 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Catering Services</h2>
          <p>
            Our catering services provide delicious meals for any event, from corporate gatherings to weddings. We offer customizable menus to suit your preferences.
          </p>
        </div>

        {/* Service Card 2 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Event Planning</h2>
          <p>
            Let us take care of the details! Our event planning services ensure that your event runs smoothly from start to finish, allowing you to enjoy the occasion.
          </p>
        </div>

        {/* Service Card 3 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Decoration Services</h2>
          <p>
            We provide stunning decoration services to transform your venue into a beautiful space that reflects your style and theme.
          </p>
        </div>

        {/* Service Card 4 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Photography</h2>
          <p>
            Capture the moments of your special day with our professional photography services. We offer packages that cater to all types of events.
          </p>
        </div>

        {/* Service Card 5 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Transportation Services</h2>
          <p>
            Ensure your guests arrive on time with our reliable transportation services. We provide shuttle services for events of all sizes.
          </p>
        </div>

        {/* Service Card 6 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Entertainment</h2>
          <p>
            From live music to DJs, we can provide entertainment options that will keep your guests engaged and having fun throughout the event.
          </p>
        </div>
      </div>

      <footer className="mt-8 text-center">
        <p>If you have any questions about our services or would like to book an appointment, feel free to contact us!</p>
      </footer>
    </div>
  );
};

export default Services;
