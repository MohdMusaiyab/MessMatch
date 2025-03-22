"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { State } from "@/app/types/States";
import Image from "next/image";
import leftSideDecoration from "../../../../../public/images/cornerDecorativeElement.svg";

// Interfaces and security question map
interface FormData {
  name: string;
  email: string;
  password: string;
  role: "COLLEGE" | "CONTRACTOR" | "CORPORATE" | "ADMIN" | "OTHER";
  securityQuestion: string;
  securityAnswer: string;
  contactNumber: string;
  address: string;
  state: string;
}

const securityQuestionMap: Record<string, string> = {
  "What is your mother's maiden name?": "MOTHERS_MAIDEN_NAME",
  "What is the name of your first pet?": "FIRST_PET_NAME",
  "What was your favorite childhood memory?": "FAVORITE_CHILDHOOD_MEMORY",
  "What is your favorite teacher's name?": "FAVORITE_TEACHER_NAME",
  "What city were you born in?": "BIRTH_TOWN_NAME",
};

const DiamondIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L2 9L12 22L22 9L12 2Z"
      className="stroke-yellow-500"
      strokeWidth="2"
    />
  </svg>
);

const RegisterPage: React.FC = () => {
  // Keep existing state management
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "OTHER",
    securityQuestion: "",
    securityAnswer: "",
    contactNumber: "",
    address: "",
    state: "", // Initialize with an empty state
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const requestData = {
        ...formData,
        securityQuestion: securityQuestionMap[formData.securityQuestion],
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        requestData
      );
      setSuccess(response.data.message || "Registration successful!");
      setLoading(false);
      router.push("/auth/login");
    } catch (err) {
      setLoading(false);

      // Check if the error is an AxiosError
      if (axios.isAxiosError(err)) {
        // Handle Axios-specific errors
        if (err.response) {
          // Server responded with an error (e.g., 4xx or 5xx)
          setError(
            err.response.data.message || "An unexpected error occurred."
          );
        } else if (err.request) {
          // No response received (e.g., network error)
          setError("Network error. Please check your internet connection.");
        } else {
          // Other Axios errors (e.g., configuration issues)
          setError("An unexpected error occurred. Please try again later.");
        }
      } else {
        // Handle non-Axios errors
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const inputClasses =
    "w-full p-3 mt-1 bg-neutral-900 border border-yellow-900/20 rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:outline-none text-neutral-300 placeholder-neutral-500";
  const labelClasses = "block text-sm font-medium text-neutral-300";

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
      {/* Left side decoration - positioned absolutely */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 opacity-60 pointer-events-none">
        <Image
          src={leftSideDecoration}
          alt="Decorative corner element"
          layout="fill"
          objectFit="contain"
          className="select-none"
        />
      </div>

      {/* Right side decoration - mirrored and positioned bottom right */}
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-60 pointer-events-none transform rotate-180">
        <Image
          src={leftSideDecoration}
          alt="Decorative corner element"
          layout="fill"
          objectFit="contain"
          className="select-none"
        />
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <div className="bg-neutral-900/80 backdrop-blur-lg p-6 md:p-8 rounded-xl shadow-2xl border border-yellow-900/20 relative">
            {/* Small decorative diagonal lines in corners of the form */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-600/40 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-600/40 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-600/40 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-600/40 rounded-br-lg"></div>

            <div className="flex items-center justify-center mb-8 space-x-2">
              <DiamondIcon />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
                Create Account
              </h1>
              <DiamondIcon />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="name" className={labelClasses}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="email" className={labelClasses}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="password" className={labelClasses}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="role" className={labelClasses}>
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  >
                    <option value="COLLEGE">College</option>
                    <option value="CONTRACTOR">Contractor</option>
                    <option value="CORPORATE">Corporate</option>
                    <option value="ADMIN">Admin</option>
                    <option value="OTHER">Other</option>
                  </select>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="securityQuestion" className={labelClasses}>
                    Security Question
                  </label>
                  <select
                    id="securityQuestion"
                    name="securityQuestion"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  >
                    <option value="">Select a security question</option>
                    {Object.keys(securityQuestionMap).map((question) => (
                      <option key={question} value={question}>
                        {question}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="securityAnswer" className={labelClasses}>
                    Security Answer
                  </label>
                  <input
                    type="text"
                    id="securityAnswer"
                    name="securityAnswer"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </motion.div>
                <div>
                  <label htmlFor="state" className={labelClasses}>
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  >
                    <option value="">Select a state</option>
                    {Object.entries(State).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="contactNumber" className={labelClasses}>
                    Contact Number
                  </label>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="address" className={labelClasses}>
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`${inputClasses} h-24 resize-none`}
                />
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500"
                >
                  {error}
                </motion.p>
              )}

              {success && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-green-500"
                >
                  {success}
                </motion.p>
              )}

              {/* Diamond divider before button */}
              <div className="flex items-center justify-center my-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent"></div>
                <div className="mx-2 transform rotate-45">
                  <div className="w-2 h-2 bg-yellow-500"></div>
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent"></div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-medium 
                  ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-yellow-500 hover:to-yellow-600"
                  }
                  transition-all duration-300 shadow-lg hover:shadow-yellow-500/20`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>
            <p className="text-neutral-300 text-sm mt-6 text-center">
              Already have an account?{" "}
              <a href="/auth/login" className="text-yellow-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
