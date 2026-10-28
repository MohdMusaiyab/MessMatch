import React from "react";
import Hero from "./components/General/Hero";
import About from "./components/General/About";
import Features from "./components/General/Features";
import CallToAction from "./components/General/CallToAction";

const page = () => {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Hero />
      <About />
      <Features />
      <CallToAction />
    </main>
  );
};

export default page;
