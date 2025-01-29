import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X } from "lucide-react";

const SideBarDashBoard = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280); // Default width

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
        setSidebarWidth(150); // Smaller width for mobile
      } else {
        setSidebarWidth(280); // Normal width for larger screens
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { href: '/dashboard/institution/auction', icon:MenuIcon , label: 'My Auction' },
    { href: '/dashboard/institution/auction/create', icon: X, label: 'Create Auction' },
    { href: '/chats', icon: MenuIcon, label: 'My Chats' },
  ];

  return (
    <motion.div
      initial={{ width: sidebarWidth }}
      animate={{ width: isExpanded ? sidebarWidth : 64 }}
      className="relative h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-r border-yellow-900/20 shadow-xl flex-shrink-0 md:relative fixed z-40"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-yellow-600 rounded-full p-1.5 hover:bg-yellow-500 transition-colors duration-300 z-50"
      >
        {isExpanded ? <X size={16} /> : <MenuIcon size={16} />}
      </button>

      {/* Logo Section */}
      <div className="p-6">
        <motion.div
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          className={`bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent text-xl font-bold mb-8 ${!isExpanded ? 'hidden' : 'block'}`}
        >
          Contractor Dashboard
        </motion.div>
      </div>

      {/* Navigation Links */}
      <nav className="overflow-hidden">
        <ul className="space-y-2 px-2">
          {menuItems.map((item, index) => (
            <motion.li
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={item.href}
                className={!isExpanded ? 'pointer-events-none' : ''}
              >
                <motion.div
                  whileHover={{ x: 6 }}
                  className={`flex items-center gap-4 text-neutral-400 hover:text-yellow-500 transition-colors duration-300 p-3 rounded-lg hover:bg-neutral-900/50 ${!isExpanded ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="whitespace-nowrap overflow-hidden text-sm">
                      {item.label}
                    </span>
                  )}
                </motion.div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default SideBarDashBoard;