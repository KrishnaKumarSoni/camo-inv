// Firebase Authentication Context
// PRD: firebase_auth: "Simple email/password login with automatic redirect to main app"
// PRD: session_management: "Firebase handles token refresh and persistence automatically"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // PRD: Simple email/password login using custom API
  async function login(email: string, password: string) {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store user data and token
    setCurrentUser(data.user);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    
    return data;
  }

  async function signup(email: string, password: string) {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    // Store user data and token
    setCurrentUser(data.user);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    
    return data;
  }

  async function logout() {
    setCurrentUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  useEffect(() => {
    // Check for existing session on app load
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}