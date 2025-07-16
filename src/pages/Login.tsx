// Login page component
// PRD: login: "Simple email/password login at /login using Firebase Auth"
// PRD: user_flow: "Simple email/password login with automatic redirect to main app"

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      
      if (isSignUp) {
        // Sign up new user
        await signup(email, password);
      } else {
        // PRD: Simple email/password login with Firebase Auth
        await login(email, password);
      }
      
      // PRD: automatic redirect to main app
      navigate('/add');
    } catch (error: any) {
      setError(`Failed to ${isSignUp ? 'sign up' : 'log in'}: ${error.message}`);
    }

    setLoading(false);
  }

  return (
    <div className="mobile-container">
      {/* PRD: Mobile-first design with max-width 414px centered on desktop */}
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* PRD: Plus Jakarta Sans headings */}
          <h1 className="font-heading text-2xl font-semibold text-center mb-2">
            Camorent Inventory
          </h1>
          <p className="text-center text-gray-medium text-sm mb-6">
            {isSignUp ? 'Create new account' : 'Sign in to your account'}
          </p>
          
          {error && (
            <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded-input text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PRD: input_styling: "Black borders, purple focus states, DM Sans font" */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-body min-h-touch"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-body min-h-touch"
                placeholder="Enter your password"
              />
            </div>

            {/* PRD: buttons: "Black background, white text, purple hover states" */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-button hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed font-medium min-h-touch"
            >
              {loading 
                ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-accent hover:text-purple-600 text-sm font-medium"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'
              }
            </button>
            
            <p className="text-gray-medium text-xs mt-4">
              Access restricted to authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}