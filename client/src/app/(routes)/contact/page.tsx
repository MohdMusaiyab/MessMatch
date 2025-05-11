"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.info(
      "Currently Under Development, instead mail to musaiyab2003@gmail.com for anything"
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 py-24 md:px-6">
          {/* Header Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
              We&apos;re here to help bring your vision to life. Reach out to us
              through any of our channels below.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Phone, title: "Call Us", info: "+91 1234567890" },
              { icon: Mail, title: "Email Us", info: "musaiyab2003@gmail.com" },
              {
                icon: MapPin,
                title: "Visit Us",
                info: "Earth",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-lg p-6 hover:bg-neutral-900/70 transition-all duration-300"
              >
                <item.icon className="w-8 h-8 text-yellow-500 mb-4" />
                <h3 className="text-neutral-300 text-lg font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-400">{item.info}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-neutral-300 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-950/50 border border-yellow-900/20 rounded-lg px-4 py-3 text-neutral-300 focus:outline-none focus:border-yellow-500/50 transition-colors duration-300"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full bg-neutral-950/50 border border-yellow-900/20 rounded-lg px-4 py-3 text-neutral-300 focus:outline-none focus:border-yellow-500/50 transition-colors duration-300"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full bg-neutral-950/50 border border-yellow-900/20 rounded-lg px-4 py-3 text-neutral-300 focus:outline-none focus:border-yellow-500/50 transition-colors duration-300"
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full bg-neutral-950/50 border border-yellow-900/20 rounded-lg px-4 py-3 text-neutral-300 focus:outline-none focus:border-yellow-500/50 transition-colors duration-300"
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-950 font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ContactPage;
