import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X } from "lucide-react";

const SideBarDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  // Handle initial state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = [
    {
      href: "/dashboard/institution/auction/",
      label: "My Auctions",
      icon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      href: "/dashboard/institution/auction/create",
      label: "Create Auction",
      icon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      href: "/chats",
      label: "My Chats",
      icon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8,9,-8s9,3.582,9,8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ width: isExpanded ? 280 : 64 }}
      animate={{ width: isExpanded ? 280 : 64 }}
      className="h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-r border-yellow-900/20 shadow-xl flex-shrink-0 md:relative fixed z-50"
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
          className={`bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent text-xl font-bold ${
            !isExpanded ? 'hidden' : 'block'
          }`}
        >
          Institution Dashboard
        </motion.div>
      </div>

      {/* Navigation Links */}
      <nav className="overflow-hidden px-2">
        <ul className="space-y-2">
          {links.map((link, index) => {
            const isActive = pathname === link.href;

            return (
              <motion.li
                key={link.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={link.href}
                  className={!isExpanded ? 'pointer-events-none' : ''}
                >
                  <motion.div
                    whileHover={{ x: 6 }}
                    className={`flex items-center gap-4 text-neutral-400 hover:text-yellow-500 transition-colors duration-300 p-3 rounded-lg hover:bg-neutral-900/50 ${
                      isActive ? 'text-yellow-500 bg-neutral-900/50' : ''
                    } ${!isExpanded ? 'justify-center' : ''}`}
                  >
                    {link.icon}
                    {isExpanded && (
                      <span className="whitespace-nowrap overflow-hidden text-sm">
                        {link.label}
                      </span>
                    )}
                  </motion.div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </motion.div>
  );
};

export default SideBarDashboard;