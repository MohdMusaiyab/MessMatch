"use client";
import React from "react";

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="mb-4">
        Welcome to our auction platform! We are dedicated to providing a seamless and engaging auction experience for both buyers and sellers. Our platform allows users to create, manage, and participate in auctions for various items and services.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
      <p className="mb-4">
        Our mission is to connect people through auctions, offering a transparent and fair marketplace where everyone can participate. We strive to empower sellers by giving them the tools they need to reach potential buyers while providing buyers with unique opportunities to acquire sought-after items.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Features</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Easy auction creation with customizable options.</li>
        <li>Real-time bidding updates to keep you informed.</li>
        <li>User-friendly interface for seamless navigation.</li>
        <li>Secure transactions with built-in payment processing.</li>
        <li>Support for various auction types (e.g., live, silent).</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
      <p className="mb-4">
        If you have any questions or feedback, feel free to reach out to us at:
      </p>
      <p className="font-medium">Email: support@example.com</p>
      <p className="font-medium">Phone: (123) 456-7890</p>
    </div>
  );
};

export default About;
