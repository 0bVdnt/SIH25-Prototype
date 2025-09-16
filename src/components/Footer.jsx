import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ocean-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-coral-500 p-2 rounded-lg">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">Ocean Hazard Reporter</span>
            </div>
            <p className="text-ocean-100 mb-4">
              Protecting our coastal communities through real-time hazard reporting and monitoring. 
              Together, we can make our oceans safer for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-ocean-100 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-ocean-100 hover:text-white transition-colors">
                  View Reports
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ocean-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-ocean-100 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-ocean-100 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-coral-500" />
                <span className="text-ocean-100">contact@oceanhazard.gov.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-coral-500" />
                <span className="text-ocean-100">+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-coral-500 mt-1" />
                <span className="text-ocean-100">
                  Ministry of Earth Sciences<br />
                  Government of India<br />
                  New Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-ocean-500 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-ocean-100 text-sm">
            © 2024 Ocean Hazard Reporter. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-ocean-100 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-ocean-100 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-ocean-100 hover:text-white text-sm transition-colors">
              Emergency Guidelines
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;