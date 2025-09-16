import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Waves, Menu, X, LogOut, User, Shield, MapPin, FileText, Info, Trophy } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Waves },
    { to: '/reports', label: 'Reports', icon: MapPin },
    { to: '/about', label: 'About', icon: Info },
  ];

  if (user?.role === 'citizen') {
    navLinks.splice(2, 0, { to: '/submit-report', label: 'Report Hazard', icon: FileText });
    navLinks.push({ to: '/gamification', label: 'Rewards', icon: Trophy });
  }

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Admin Dashboard', icon: Shield });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-ocean-500 to-blue-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl group-hover:rotate-3">
              <Waves className="h-7 w-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-2xl bg-gradient-to-r from-ocean-600 to-blue-700 bg-clip-text text-transparent">
                TarangNetra
              </div>
              <div className="text-xs text-gray-500 font-medium tracking-wide">Ocean Safety Vision</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-50/50 rounded-2xl p-1 border border-gray-100">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`group flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative min-w-[120px] text-center ${
                    isActive(to)
                      ? 'text-ocean-600 bg-white shadow-md border border-ocean-200'
                      : 'text-gray-600 hover:text-ocean-600 hover:bg-white/60'
                  }`}
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="whitespace-nowrap">{label}</span>
                  {isActive(to) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-ocean-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <NotificationCenter />
                <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-5 py-3 border border-gray-200">
                  <div className={`p-2 rounded-xl ${user.role === 'admin' ? 'bg-red-100' : 'bg-ocean-100'}`}>
                    {user.role === 'admin' ? (
                      <Shield className="h-5 w-5 text-red-600" />
                    ) : (
                      <User className="h-5 w-5 text-ocean-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize font-medium">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-50 hover:to-red-100 text-gray-700 hover:text-red-600 px-5 py-3 rounded-2xl font-semibold text-sm flex items-center space-x-2 transition-all duration-300 border border-gray-200 hover:border-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-ocean-500 to-blue-600 hover:from-ocean-600 hover:to-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Join Now
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-2xl text-gray-600 hover:text-ocean-600 hover:bg-gray-50 transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-xl rounded-3xl mt-4 border border-gray-100 shadow-xl">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
                    isActive(to)
                      ? 'text-ocean-600 bg-ocean-50 border border-ocean-100'
                      : 'text-gray-600 hover:text-ocean-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {user ? (
                <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
                  <div className="flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                    <div className={`p-2 rounded-xl ${user.role === 'admin' ? 'bg-red-100' : 'bg-ocean-100'}`}>
                      {user.role === 'admin' ? (
                        <Shield className="h-6 w-6 text-red-600" />
                      ) : (
                        <User className="h-6 w-6 text-ocean-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-6 py-4 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 font-semibold"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-gradient-to-r from-ocean-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-bold text-base mt-6"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;