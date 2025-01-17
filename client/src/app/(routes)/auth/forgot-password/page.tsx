"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SecurityQuestions = [
  { value: 'MOTHERS_MAIDEN_NAME', label: "Mother's Maiden Name" },
  { value: 'FIRST_PET_NAME', label: "First Pet's Name" },
  { value: 'FAVORITE_CHILDHOOD_MEMORY', label: 'Favorite Childhood Memory' },
  { value: 'FAVORITE_TEACHER_NAME', label: 'Favorite Teacher Name' },
  { value: 'BIRTH_TOWN_NAME', label: 'Birth Town Name' },
];

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [securityQuestion, setSecurityQuestion] = useState<string>('');
  const [securityAnswer, setSecurityAnswer] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`, {
        email,
        securityQuestion,
        securityAnswer,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'Something went wrong!');
      } else {
        setMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
          Reset Password
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-b from-neutral-900 to-neutral-950 p-8 rounded-lg border border-yellow-900/20 backdrop-blur-sm shadow-xl"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-yellow-900/20 rounded-md p-3 text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40 transition-all duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Security Question</label>
            <select
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-yellow-900/20 rounded-md p-3 text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40 transition-all duration-300"
            >
              <option value="">Select a question</option>
              {SecurityQuestions.map((question) => (
                <option key={question.value} value={question.value} className="bg-neutral-900">
                  {question.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Answer</label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-yellow-900/20 rounded-md p-3 text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40 transition-all duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-yellow-900/20 rounded-md p-3 text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40 transition-all duration-300"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold py-3 rounded-md hover:shadow-lg hover:shadow-yellow-600/20 transition-all duration-300"
          >
            Reset Password
          </motion.button>
        </form>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-center ${
              message.includes('success') ? 'text-yellow-500' : 'text-red-500'
            }`}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;