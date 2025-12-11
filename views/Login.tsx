import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Chrome, Facebook, Apple, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithProvider, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleProviderLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setError('');
    try {
      await loginWithProvider(provider);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : `Login with ${provider} failed`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#302e2b] to-[#1a1a1a] flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-400 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Login</h1>
          <p className="text-gray-400">Welcome back to GrandmasterStream</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#262421] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-chess-accent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#262421] border border-gray-700 rounded-lg py-2 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-chess-accent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-chess-accent hover:bg-chess-accentHover disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-500 text-sm">or login with</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleProviderLogin('google')}
            disabled={isLoading}
            className="bg-[#262421] hover:bg-[#302e2b] border border-gray-700 rounded-lg py-2 flex items-center justify-center text-white transition disabled:opacity-50"
            title="Login with Google"
          >
            <Chrome size={20} />
          </button>
          <button
            onClick={() => handleProviderLogin('facebook')}
            disabled={isLoading}
            className="bg-[#262421] hover:bg-[#302e2b] border border-gray-700 rounded-lg py-2 flex items-center justify-center text-white transition disabled:opacity-50"
            title="Login with Facebook"
          >
            <Facebook size={20} />
          </button>
          <button
            onClick={() => handleProviderLogin('apple')}
            disabled={isLoading}
            className="bg-[#262421] hover:bg-[#302e2b] border border-gray-700 rounded-lg py-2 flex items-center justify-center text-white transition disabled:opacity-50"
            title="Login with Apple"
          >
            <Apple size={20} />
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-chess-accent hover:text-chess-accentHover font-semibold transition"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
