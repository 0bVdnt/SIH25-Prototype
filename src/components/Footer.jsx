import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Waves, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github, 
  ExternalLink, ArrowRight 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Animated Wave Background */}
      <div className="absolute bottom-0 left-0 w-full h-24 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" 
                fill="currentColor" 
                className="text-blue-400 animate-pulse-slow">
            <animate attributeName="d" 
                     dur="8s" 
                     repeatCount="indefinite"
                     values="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z;
                             M0,40 C200,80 400,40 600,80 C800,40 1000,80 1200,40 L1200,120 L0,120 Z;
                             M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" />
          </path>
        </svg>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            
            {/* Logo and Description */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Waves className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-2xl bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    Ocean Hazard Reporter
                  </h2>
                  <p className="text-slate-300 text-sm">Ministry of Earth Sciences</p>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed text-lg">
                Protecting our coastal communities through real-time hazard reporting and advanced monitoring systems. 
                Together, we create safer oceans for future generations.
              </p>

              {/* Social Media */}
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                  { icon: Twitter, href: "#", color: "hover:bg-sky-500" },
                  { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                  { icon: Github, href: "#", color: "hover:bg-gray-700" }
                ].map(({ icon: Icon, href, color }, index) => (
                  <a 
                    key={index}
                    href={href} 
                    className={`p-3 bg-white/10 backdrop-blur-sm rounded-xl ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                  >
                    <Icon className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-4 text-white flex items-center">
                Quick Links
                <ArrowRight className="h-4 w-4 ml-2 text-blue-400" />
              </h3>
              <ul className="space-y-3">
                {[
                  { to: "/", label: "Home" },
                  { to: "/map", label: "Hazard Map" },
                  { to: "/reports", label: "View Reports" },
                  { to: "/submit-report", label: "Report Hazard" },
                  { to: "/about", label: "About Us" },
                  { to: "/admin", label: "Admin Portal" }
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link 
                      to={to} 
                      className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group"
                    >
                      <span>{label}</span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-4 text-white flex items-center">
                Services
                <ArrowRight className="h-4 w-4 ml-2 text-cyan-400" />
              </h3>
              <ul className="space-y-3">
                {[
                  "Emergency Response",
                  "Hazard Monitoring", 
                  "Community Alerts",
                  "Research Portal",
                  "Data Analytics",
                  "API Access"
                ].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                      <span>{service}</span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-3">
              <h3 className="font-semibold text-lg mb-4 text-white flex items-center">
                Get in Touch
                <ArrowRight className="h-4 w-4 ml-2 text-green-400" />
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors">
                  <Mail className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-300 text-sm">Email</p>
                    <a href="mailto:contact@oceanhazard.gov.in" className="text-white hover:text-blue-300 transition-colors">
                      contact@oceanhazard.gov.in
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors">
                  <Phone className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-300 text-sm">Emergency Hotline</p>
                    <a href="tel:+918275200000" className="text-white hover:text-green-300 transition-colors">
                      +91 82752-00000
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors">
                  <MapPin className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-300 text-sm">Address</p>
                    <p className="text-white text-sm leading-relaxed">
                      Ministry of Earth Sciences<br />
                      Prithvi Bhavan, Lodi Road<br />
                      New Delhi - 110003, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Clean minimal design */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-center">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;