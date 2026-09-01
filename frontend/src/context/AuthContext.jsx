import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ner_lews_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ner_lews_token') || null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({
    mode: 'login', // 'login' | 'register'
    initialRole: 'citizen', // 'citizen' | 'authority'
    redirectAfterLogin: null
  });

  // Verify active session on load
  useEffect(() => {
    async function verifySession() {
      if (token) {
        try {
          const freshUser = await api.getMe();
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem('ner_lews_user', JSON.stringify(freshUser));
          } else {
            // Keep existing user if offline
          }
        } catch (err) {
          console.warn('[AuthContext] Session check failed, using stored state:', err.message);
        }
      }
      setIsLoading(false);
    }
    verifySession();
  }, [token]);

  const openAuthModal = ({ mode = 'login', initialRole = 'citizen', redirectAfterLogin = null } = {}) => {
    setAuthModalConfig({ mode, initialRole, redirectAfterLogin });
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ner_lews_token', data.token);
      localStorage.setItem('ner_lews_user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return data.user;
    }
    throw new Error('Invalid login response');
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ner_lews_token', data.token);
      localStorage.setItem('ner_lews_user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return data.user;
    }
    throw new Error('Invalid registration response');
  };

  const quickLogin = async (role = 'authority') => {
    if (role === 'authority') {
      return await login('officer@sdma.gov.in', 'Officer@123');
    } else {
      return await login('citizen@ner.in', 'Citizen@123');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ner_lews_token');
    localStorage.removeItem('ner_lews_user');
  };

  const isAuthority = Boolean(user && (user.role === 'authority' || user.role === 'admin'));
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAuthority,
        isAuthModalOpen,
        authModalConfig,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        quickLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
