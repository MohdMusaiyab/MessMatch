"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ChevronRight, Diamond } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Redirect to dashboard instead of home
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGuestLogin = async (role: "contractor" | "institution") => {
    setLoading(true);
    setError("");

    const email =
      role === "contractor"
        ? process.env.NEXT_PUBLIC_CONTRACTOR_EMAIL
        : process.env.NEXT_PUBLIC_INSTITUTION_EMAIL;
    const password =
      role === "contractor"
        ? process.env.NEXT_PUBLIC_CONTRACTOR_PASSWORD
        : process.env.NEXT_PUBLIC_INSTITUTION_PASSWORD;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col w-2/3 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-12 justify-center relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-gradient-to-tl from-yellow-600/10 to-transparent rounded-full blur-3xl" />

        <div className="mb-12 relative z-10">
          <Diamond className="w-20 h-20 text-yellow-500 mb-8" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-8">
            MessConnect
          </h1>
          <p className="text-2xl text-neutral-400 max-w-xl">
            Connecting Quality Mess Contractors with Premium Institutions
          </p>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950 relative overflow-hidden"
      >
        {/* Corner Triangles */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-r-[100px] border-t-yellow-500/20 border-r-transparent" />
        <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[100px] border-l-[100px] border-b-yellow-500/20 border-l-transparent" />

        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5" />

        <div className="w-full max-w-md p-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/90 backdrop-blur-xl p-8 rounded-2xl border border-yellow-900/20 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 text-white placeholder-neutral-500"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-neutral-500" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 text-white placeholder-neutral-500"
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-neutral-500" />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? (
                  "Signing In..."
                ) : (
                  <>
                    <span>Sign In</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            <p className="text-neutral-300 text-sm mt-4 text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-yellow-500 hover:underline"
              >
                Register Here
              </Link>
            </p>

            <p className="text-center text-sm">
              <Link
                href="/auth/forgot-password"
                className=" text-yellow-500  hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
            <p
              onClick={() => setShowGuestModal(true)}
              className="text-center text-sm mt-4 text-white bg-yellow-500/10 p-2 rounded-lg cursor-pointer hover:bg-yellow-500/20 transition-colors duration-200"
            >
              Guest Login
            </p>
            {showGuestModal && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowGuestModal(false)} // Close when clicking backdrop
              >
                <div
                  className="bg-neutral-900 p-6 rounded-xl shadow-2xl w-[90%] max-w-sm space-y-4 border border-yellow-900/30 relative"
                  onClick={(e) => e.stopPropagation()} // Prevent click bubbling
                >
                  <h3 className="text-white text-lg font-semibold text-center">
                    Continue as Guest
                  </h3>

                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}

                  <button
                    onClick={() => handleGuestLogin("contractor")}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg transition"
                  >
                    Login as Mess Contractor
                  </button>
                  <button
                    onClick={() => handleGuestLogin("institution")}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg transition"
                  >
                    Login as Institution
                  </button>
                  <button
                    onClick={() => setShowGuestModal(false)}
                    className="text-sm text-neutral-400 hover:text-white text-center w-full mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
