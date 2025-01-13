'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Utensils, CheckCircle, DollarSign } from 'lucide-react';

const Features = () => {
 const featureList = [
   {
     title: 'Easy Connections',
     description: 'Seamlessly connect with mess contractors who meet your specific requirements.',
     icon: <Shield className="w-8 h-8" />,
   },
   {
     title: 'Customizable Menus', 
     description: 'Create and customize meal plans that cater to diverse dietary needs.',
     icon: <Utensils className="w-8 h-8" />,
   },
   {
     title: 'Reliable Service',
     description: 'Enjoy dependable service from vetted contractors with positive reviews.',
     icon: <CheckCircle className="w-8 h-8" />,
   },
   {
     title: 'Cost-Effective Solutions',
     description: 'Find competitive pricing options that fit your budget without compromising quality.',
     icon: <DollarSign className="w-8 h-8" />,
   },
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
   hidden: { opacity: 0, y: 20 },
   visible: {
     opacity: 1,
     y: 0,
     transition: {
       duration: 0.5
     }
   }
 };

 return (
   <div className="py-24 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
     <div className="container mx-auto px-4">
       <motion.div
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         className="text-center mb-16"
       >
         <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-6">
           Our Features
         </h2>
         <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-700 mx-auto rounded-full"/>
       </motion.div>

       <motion.div 
         variants={containerVariants}
         initial="hidden"
         animate="visible"
         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
       >
         {featureList.map((feature, index) => (
           <motion.div
             key={index}
             variants={itemVariants}
             whileHover={{ 
               scale: 1.05,
               transition: { duration: 0.2 }
             }}
             className="bg-neutral-900/50 backdrop-blur p-8 rounded-lg border border-yellow-900/20 
                        shadow-lg hover:shadow-yellow-500/10 transition-all duration-300
                        flex flex-col items-center text-center"
           >
             <div className="mb-6 text-yellow-500 bg-neutral-800/50 p-4 rounded-full">
               {feature.icon}
             </div>
             <h3 className="text-xl font-semibold mb-4 text-white">
               {feature.title}
             </h3>
             <p className="text-neutral-400 leading-relaxed">
               {feature.description}
             </p>
           </motion.div>
         ))}
       </motion.div>
     </div>
   </div>
 );
};

export default Features;