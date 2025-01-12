"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Diamond,
  Menu,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  Search,
  LogOut,
} from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-yellow-900/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Diamond className="h-6 w-6 text-yellow-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 text-transparent bg-clip-text">
                BidConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/explore"
                className="text-neutral-300 hover:text-yellow-500 transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/dashboard"
                className="text-neutral-300 hover:text-yellow-500 transition-colors"
              >
                Dashboard
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              {session ? (
                <div className="relative group hidden md:block">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-yellow-500/50 transition-colors">
                    <span className="text-neutral-200">
                      {session.user?.name}
                    </span>
                    <ChevronDown className="h-4 w-4 text-neutral-400 group-hover:text-yellow-500 transition-colors" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {/* <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-neutral-300 hover:text-yellow-500 hover:bg-neutral-800/50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link> */}
                    {/* <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-neutral-300 hover:text-yellow-500 hover:bg-neutral-800/50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link> */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 md:hidden">
          <div className="container mx-auto px-4 py-6">
            {/* Navigation Links */}
            <nav className="space-y-4">
              <Link
                href="/explore"
                className="block text-lg text-neutral-300 hover:text-yellow-500 transition-colors"
              >
                Explore
              </Link>

              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="block text-lg text-neutral-300 hover:text-yellow-500 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block text-lg text-neutral-300 hover:text-yellow-500 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block text-lg text-neutral-300 hover:text-yellow-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/login">
                  <button className="w-full px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg transition-all">
                    Login
                  </button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
