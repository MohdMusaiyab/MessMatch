"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "COLLEGE" | "CONTRACTOR" | "CORPORATE" | "ADMIN" | "OTHER";
  securityQuestion: string;
  securityAnswer: string;
}

// Map of user-friendly security questions to enums used in the backend
// Map of user-friendly security questions to enums used in the backend
const securityQuestionMap: Record<string, string> = {
  "What is your mother's maiden name?": "MOTHERS_MAIDEN_NAME", // Correct enum
  "What is the name of your first pet?": "FIRST_PET_NAME",
  "What was your favorite childhood memory?": "FAVORITE_CHILDHOOD_MEMORY",
  "What is your favorite teacher's name?": "FAVORITE_TEACHER_NAME",
  "What city were you born in?": "BIRTH_TOWN_NAME",
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "OTHER", // Default role
    securityQuestion: "",
    securityAnswer: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Map user-friendly security question to backend enum before sending
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

      // Redirect to the login page
      router.push("/auth/login");
    } catch (err: any) {
      setLoading(false);
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded focus:ring focus:ring-indigo-200 focus:outline-none"
            >
              <option value="COLLEGE">College</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="CORPORATE">Corporate</option>
              <option value="ADMIN">Admin</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="securityQuestion"
              className="block text-sm font-medium text-gray-700"
            >
              Security Question
            </label>
            <select
              id="securityQuestion"
              name="securityQuestion"
              value={formData.securityQuestion}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded focus:ring focus:ring-indigo-200 focus:outline-none"
            >
              <option value="">Select a security question</option>
              {Object.keys(securityQuestionMap).map((question) => (
                <option key={question} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="securityAnswer"
              className="block text-sm font-medium text-gray-700"
            >
              Security Answer
            </label>
            <input
              type="text"
              id="securityAnswer"
              name="securityAnswer"
              value={formData.securityAnswer}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;