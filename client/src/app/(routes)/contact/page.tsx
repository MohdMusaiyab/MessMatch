"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const ContactPage = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    toast.success("Thank you for reaching out! Your message has been received.");
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 py-24 md:px-6">
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
            Have questions about institutional dining auctions or caterer onboarding? Reach out to our team directly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Phone, title: "Phone Support", info: "+91 98765 43210" },
            { icon: Mail, title: "Email Us", info: "musaiyab2003@gmail.com" },
            {
              icon: MapPin,
              title: "Headquarters",
              info: "New Delhi, India",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-300"
            >
              <item.icon className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-400 text-sm">{item.info}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-300 mb-2 text-sm font-medium">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name or institution"
                    className="w-full bg-neutral-950/70 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-500/60 transition-colors"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-2 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-neutral-950/70 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-500/60 transition-colors"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-2 text-sm font-medium">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. University Dining Tender Inquiry"
                  className="w-full bg-neutral-950/70 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-500/60 transition-colors"
                  value={formState.subject}
                  onChange={(e) =>
                    setFormState({ ...formState, subject: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-2 text-sm font-medium">Message</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us about your requirements, timeline, or feedback..."
                  className="w-full bg-neutral-950/70 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-500/60 transition-colors resize-none"
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-neutral-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all duration-200"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
