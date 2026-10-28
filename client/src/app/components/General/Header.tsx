"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="relative z-50" ref={menuRef}>
      <div className="bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 sticky top-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="MessMatch" 
                width={140}
                height={50}
                className="object-contain w-32 md:w-36 h-auto"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-6 flex-grow justify-center ml-4">
              <Link
                href="/explore"
                className="text-neutral-300 hover:text-yellow-400 text-sm font-medium transition-colors px-2 py-1"
              >
                Explore
              </Link>
              <Link
                href="/services"
                className="text-neutral-300 hover:text-yellow-400 text-sm font-medium transition-colors px-2 py-1"
              >
                Services
              </Link>
              <Link
                href="/about"
                className="text-neutral-300 hover:text-yellow-400 text-sm font-medium transition-colors px-2 py-1"
              >
                About
              </Link>
              <Link
                href="/dashboard"
                className="text-neutral-300 hover:text-yellow-400 text-sm font-medium transition-colors px-2 py-1"
              >
                Dashboard
              </Link>
              {session && (
                <Link
                  href="/chats"
                  className="text-neutral-300 hover:text-yellow-400 text-sm font-medium transition-colors px-2 py-1"
                >
                  Chats
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4 ml-auto">
              {status === "loading" ? (
                <div className="w-24 h-9 bg-neutral-800/60 animate-pulse rounded-lg hidden md:block" />
              ) : session ? (
                <div className="relative group hidden md:block">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-yellow-500/50 transition-colors">
                    <span className="text-neutral-200 text-sm font-medium truncate max-w-[120px]">
                      {session.user?.name || "Account"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-neutral-400 group-hover:text-yellow-400 transition-colors" />
                  </button>

                  <div className="absolute right-0 mt-2 w-48 py-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center px-4 py-2 text-sm text-neutral-300 hover:text-yellow-400 hover:bg-neutral-800/50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/chats"
                      className="w-full flex items-center px-4 py-2 text-sm text-neutral-300 hover:text-yellow-400 hover:bg-neutral-800/50 transition-colors"
                    >
                      Chats
                    </Link>
                    <Link
                      href="/profile"
                      className="w-full flex items-center px-4 py-2 text-sm text-neutral-300 hover:text-yellow-400 hover:bg-neutral-800/50 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/auth/login" })}
                      className="w-full flex items-center px-4 py-2 text-sm text-neutral-300 hover:text-yellow-400 hover:bg-neutral-800/50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login">
                  <button className="hidden md:block px-5 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-neutral-950 font-bold text-sm rounded-lg shadow-md transition-all">
                    Sign In
                  </button>
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-neutral-300 hover:text-yellow-400 transition-colors"
                aria-label="Toggle navigation menu"
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

      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 md:hidden">
          <div className="bg-neutral-950/95 border-b border-neutral-800 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-6">
              <nav className="space-y-4">
                <Link
                  href="/explore"
                  className="block text-base text-neutral-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Explore Marketplace
                </Link>
                <Link
                  href="/services"
                  className="block text-base text-neutral-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/about"
                  className="block text-base text-neutral-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="block text-base text-neutral-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-base text-neutral-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {session ? (
                  <>
                    <Link
                      href="/chats"
                      className="block text-base text-neutral-300 hover:text-yellow-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Chats
                    </Link>
                    <Link
                      href="/profile"
                      className="block text-base text-neutral-300 hover:text-yellow-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/auth/login" });
                        setIsMobileMenuOpen(false);
                      }}
                      className="block text-base text-neutral-300 hover:text-yellow-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block pt-2"
                  >
                    <button className="w-full px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-neutral-950 font-bold rounded-lg transition-all">
                      Sign In
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
