"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { securityQuestions } from "@/app/types/securtyQuestions";

const UpdateUserInformation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    contactNumber: "",
    securityQuestion: securityQuestions.MOTHERS_MAIDEN_NAME, // Default value
    securityAnswer: "",
    password: "", // New password
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/my-profile`,
                { withCredentials: true }
            );
            console.log(response.data);
            const user = response.data.data;
            setFormData({
                name: user?.name ?? "",
                email: user?.email ?? "",
                address: user?.address ?? "",
                contactNumber: user?.contactNumber ?? "",
                securityQuestion: user?.securityQuestion ?? securityQuestions.MOTHERS_MAIDEN_NAME, // Set enum value
                securityAnswer: user?.securityAnswer ?? "",
                password: "", // No password shown, empty for updating
            });
        } catch (err) {
            console.error(err);
            setError("Failed to load user data");
        }
    };

    fetchUserData();
}, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("User information updated successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating user information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Update Your Information</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="securityQuestion">Security Question</label>
          <select
            id="securityQuestion"
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleChange}
            required
          >
            {Object.entries(securityQuestions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="securityAnswer">Security Answer</label>
          <input
            type="text"
            id="securityAnswer"
            name="securityAnswer"
            value={formData.securityAnswer}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">New Password (optional)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Information"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserInformation;
