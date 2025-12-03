'use client';

import Link from 'next/link';
import { Settings, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">PredictiveCare</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Advanced industrial maintenance solutions powered by machine learning and IoT technology.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <div className="space-y-4">
              {['Home', 'Features', 'About', 'Dashboard', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>contact@predictivecare.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <span>123 Tech Street<br />Innovation City, ST 12345</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest features and news.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PredictiveCare. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
