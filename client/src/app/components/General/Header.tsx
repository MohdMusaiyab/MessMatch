"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import logo from "../../../../public/logo.png";
import Image from "next/image";

const Header: React.FC = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent Body Scrolling
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="relative z-50" ref={menuRef}>
      {/* Main Header */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-yellow-900/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Fixed Width */}
            <Link href="/" className="flex-shrink-0 w-32 md:w-40">
              <Image 
                src={logo} 
                alt="MessBazaar" 
                width={160}  // Reduced from 250
                height={64}   // Reduced proportionally
                className="object-contain w-full h-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation - Now has more space */}
            <nav className="hidden md:flex items-center space-x-6 flex-grow justify-center ml-4">
              <Link
                href="/explore"
                className="text-neutral-300 hover:text-yellow-500 transition-colors px-3 py-2"
              >
                Explore
              </Link>
              <Link
                href="/dashboard"
                className="text-neutral-300 hover:text-yellow-500 transition-colors px-3 py-2"
              >
                Dashboard
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4 ml-auto">
              {session ? (
                <div className="relative group hidden md:block">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-yellow-500/50 transition-colors">
                    <span className="text-neutral-200 truncate max-w-[120px]">
                      {session.user?.name || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-neutral-400 group-hover:text-yellow-500 transition-colors" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/profile"
                      className="w-full flex items-center px-4 py-2 text-neutral-300 hover:text-yellow-500 hover:bg-neutral-800/50 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center px-4 py-2 text-neutral-300 hover:text-yellow-500 hover:bg-neutral-800/50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login">
                  <button className="hidden md:block px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg transition-all">
                    Login
                  </button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-neutral-300 hover:text-yellow-500 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu (unchanged) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 md:hidden">
          <div className="bg-neutral-950/95 border-b border-yellow-900/20 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-300 hover:text-yellow-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="space-y-4">
                <Link
                  href="/explore"
                  className="block text-lg text-neutral-300 hover:text-yellow-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-lg text-neutral-300 hover:text-yellow-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className="block text-lg text-neutral-300 hover:text-yellow-500 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block text-lg text-neutral-300 hover:text-yellow-500 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg transition-all">
                      Login
                    </button>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;