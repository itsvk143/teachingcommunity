"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert("Message sent successfully!");
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* About Us Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Our Mission</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-8">Empowering the Education Ecosystem</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-4xl mx-auto">
            Teaching Community is more than just a platform; it is India's premier network dedicated to transforming how education professionals connect.
            We bridge the gap between talented educators and leading institutions, ensuring that quality education helps shape the future.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            From helping coaching centers find star faculty to connecting students with expert home tutors, we simplify recruitment and discovery.
            Our commitment is to transparency, quality, and growth for every stakeholder in the learning journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t border-gray-100 pt-8">
            <div className="p-4">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">500+</h3>
              <p className="text-gray-600 font-medium">Institutes Listed</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">10k+</h3>
              <p className="text-gray-600 font-medium">Students Helped</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">24/7</h3>
              <p className="text-gray-600 font-medium">Support Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section (Blue Banner) */}
      <div className="bg-blue-600 text-white py-16 md:py-20 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Have questions about finding the right coaching or listing your institute? We are here to help you every step of the way.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2">

            {/* Contact Info Side */}
            <div className="bg-gray-800 text-white p-10 md:p-12 lg:p-16 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="text-blue-400" /> Contact Information
                </h2>
                <p className="text-gray-400 mb-10 leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours. Alternatively, reach out directly via:
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-400">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-gray-300 hover:text-white transition">(+91) 7014660914</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-400">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-gray-300 hover:text-white transition">teachingcommunityzone@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Visit Us</h3>
                      <p className="text-gray-300 hover:text-white transition">
                        Plot no 125, Chandrashekharpur,<br />
                        Bhubaneswar, Odisha 751016
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-10 md:p-12 lg:p-16 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {submitted ? 'Sending...' : <>Send Message <Send className="w-5 h-5" /></>}
                </button>
              </form>
            </div>

          </div>
        </div>


      </div>
    </div>
  );
}
