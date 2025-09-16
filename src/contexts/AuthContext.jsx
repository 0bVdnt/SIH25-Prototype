import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded users for demo
  const users = {
    citizen: {
      id: 1,
      username: 'citizen',
      password: 'citizen123',
      role: 'citizen',
      name: 'Citizen User'
    },
    admin: {
      id: 2,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Admin User'
    }
  };

  useEffect(() => {
    // Check if user is logged in (localStorage)
    const storedUser = localStorage.getItem('hazard_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = Object.values(users).find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('hazard_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hazard_user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCitizen: user?.role === 'citizen'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};