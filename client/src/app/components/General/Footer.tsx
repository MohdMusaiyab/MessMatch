'use client'
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
 const navLinks = [
   { name: 'Home', href: '/' },
   { name: 'About', href: '/about' },
   { name: 'Services', href: '/services' },
   { name: 'Contact', href: '/contact' },
 ];

 const socialLinks = [
   { icon: <Github className="w-5 h-5" />, href: '#' },
   { icon: <Twitter className="w-5 h-5" />, href: '#' },
   { icon: <Linkedin className="w-5 h-5" />, href: '#' },
   { icon: <Mail className="w-5 h-5" />, href: '#' },
 ];

 return (
   <footer className="bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-300 py-12 border-t border-yellow-900/20">
     <div className="container mx-auto px-4">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
         {/* Company Info */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="col-span-1 md:col-span-2"
         >
           <h5 className="text-xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-4">
             MessConnect
           </h5>
           <p className="text-neutral-400 mb-6 max-w-md">
             Connecting quality mess contractors with institutions for seamless catering solutions.
           </p>
           <div className="flex space-x-4">
             {socialLinks.map((social, index) => (
               <motion.a
                 key={index}
                 href={social.href}
                 whileHover={{ scale: 1.1, color: '#EAB308' }}
                 className="text-neutral-400 hover:text-yellow-500 transition-colors duration-300"
               >
                 {social.icon}
               </motion.a>
             ))}
           </div>
         </motion.div>

         {/* Quick Links */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
         >
           <h6 className="text-white font-semibold mb-4">Quick Links</h6>
           <ul className="space-y-3">
             {navLinks.map((link, index) => (
               <li key={index}>
                 <Link 
                   href={link.href}
                   className="text-neutral-400 hover:text-yellow-500 transition-colors duration-300"
                 >
                   {link.name}
                 </Link>
               </li>
             ))}
           </ul>
         </motion.div>

         {/* Contact Info */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
         >
           <h6 className="text-white font-semibold mb-4">Contact Us</h6>
           <div className="space-y-3 text-neutral-400">
             <p>Lightning Technologies</p>
             <p>contact@messconnect.com</p>
             <p>+1 (555) 123-4567</p>
           </div>
         </motion.div>
       </div>

       {/* Copyright */}
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.4 }}
         className="mt-12 pt-6 border-t border-neutral-800 text-center text-neutral-500"
       >
         <p>
           © {new Date().getFullYear()} MessConnect. All rights reserved.
         </p>
       </motion.div>
     </div>
   </footer>
 );
};

export default Footer;