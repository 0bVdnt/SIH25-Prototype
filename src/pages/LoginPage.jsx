import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Waves, Shield, User } from 'lucide-react';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('citizen');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(formData.username, formData.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleQuickLogin = (type) => {
    const credentials = type === 'citizen' 
      ? { username: 'citizen', password: 'citizen123' }
      : { username: 'admin', password: 'admin123' };
    
    setFormData(credentials);
    const result = login(credentials.username, credentials.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-ocean-500 p-3 rounded-full">
              <Waves className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Ocean Hazard Reporter
          </h2>
          <p className="text-gray-600">
            Sign in to report and monitor ocean hazards
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* User Type Toggle */}
          <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setUserType('citizen')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'citizen'
                  ? 'bg-ocean-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'admin'
                  ? 'bg-ocean-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </button>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleQuickLogin('citizen')}
              className="w-full bg-ocean-500 hover:bg-ocean-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Quick Login as Citizen
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="w-full bg-coral-500 hover:bg-coral-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Quick Login as Admin
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or login manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-ocean-500 hover:bg-ocean-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo Credentials:</p>
            <p>Citizen: citizen / citizen123</p>
            <p>Admin: admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;