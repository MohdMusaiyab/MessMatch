"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "COLLEGE" | "CONTRACTOR" | "CORPORATE" | "ADMIN" | "OTHER";
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "OTHER", // Default role
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        formData
      );
      setSuccess(response.data.message || "Registration successful!");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="COLLEGE">College</option>
            <option value="CONTRACTOR">Contractor</option>
            <option value="CORPORATE">Corporate</option>
            <option value="ADMIN">Admin</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default RegisterPage;
