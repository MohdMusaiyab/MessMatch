import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu as MenuIcon, X, BookOpen, MessageCircle, Gavel } from 'lucide-react';

const SideBarDashBoard = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { href: '/dashboard/contractor/menu', icon: BookOpen, label: 'My Menu' },
    { href: '/chats', icon: MessageCircle, label: 'My Chats' },
    { href: '/dashboard/contractor/my-auctions', icon: Gavel, label: 'My Auctions' },
  ];

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isExpanded ? 280 : 80 }}
      className="h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-r border-yellow-900/20 relative"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-4 top-6 bg-yellow-600 rounded-full p-1.5 hover:bg-yellow-500 transition-colors duration-300"
      >
        {isExpanded ? <X size={16} /> : <MenuIcon size={16} />}
      </button>

      <div className="p-6">
        <motion.div
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent text-xl font-bold mb-8"
        >
          Contractor Dashboard
        </motion.div>

        <nav>
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 text-neutral-400 hover:text-yellow-500 transition-colors duration-300 p-2 rounded-lg hover:bg-neutral-900/50"
                  >
                    <item.icon className="w-5 h-5" />
                    {isExpanded && <span>{item.label}</span>}
                  </motion.div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.div>
  );
};

export default SideBarDashBoard;