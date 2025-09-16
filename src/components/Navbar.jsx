import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Waves, Menu, X, LogOut, User, Shield, MapPin, FileText, Info, Calendar } from 'lucide-react';

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
    { to: '/events', label: 'Events', icon: Calendar },
  ];

  if (user?.role === 'citizen') {
    navLinks.splice(2, 0, { to: '/submit-report', label: 'Report Hazard', icon: FileText });
  }

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Admin Dashboard', icon: Shield });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors">
            <div className="bg-ocean-500 p-2 rounded-lg">
              <Waves className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">TarangNetra</span>
            <span className="font-bold text-lg sm:hidden">Endless vision for ocean safety</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'text-ocean-600 bg-ocean-50'
                    : 'text-gray-600 hover:text-ocean-600 hover:bg-ocean-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  {user.role === 'admin' ? (
                    <Shield className="h-4 w-4 text-coral-500" />
                  ) : (
                    <User className="h-4 w-4 text-ocean-500" />
                  )}
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-coral-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-ocean-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(to)
                      ? 'text-ocean-600 bg-ocean-50'
                      : 'text-gray-600 hover:text-ocean-600 hover:bg-ocean-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {user ? (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700">
                    {user.role === 'admin' ? (
                      <Shield className="h-4 w-4 text-coral-500" />
                    ) : (
                      <User className="h-4 w-4 text-ocean-500" />
                    )}
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-600 hover:text-coral-500 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2 rounded-md text-base font-medium transition-colors mt-4"
                >
                  Login
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