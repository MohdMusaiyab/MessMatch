"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/mohdMusaiyab/",
      label: "GitHub",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://x.com/mohd_musaiyab",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://www.linkedin.com/in/mohd-musaiyab/",
      label: "LinkedIn",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:musaiyab2003@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-300 py-14 border-t border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 md:col-span-2"
          >
            <h5 className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent mb-4">
              MessMatch
            </h5>
            <p className="text-neutral-400 mb-6 max-w-md text-sm leading-relaxed">
              The marketplace connecting universities, corporate parks, and accredited mess contractors for transparent dining auctions and culinary excellence.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, color: "#EAB308" }}
                  className="text-neutral-400 hover:text-yellow-400 transition-colors duration-200 p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-yellow-500/40"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h6 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navigation
            </h6>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-yellow-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h6 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Platform & Support
            </h6>
            <div className="space-y-2.5 text-sm text-neutral-400">
              <p>New Delhi, India</p>
              <p>musaiyab2003@gmail.com</p>
              <p>+91 98765 43210</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Systems Operational
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4"
        >
          <p>© {new Date().getFullYear()} MessMatch. All rights reserved.</p>
          <p>Built for institutional dining transparency and student satisfaction.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
