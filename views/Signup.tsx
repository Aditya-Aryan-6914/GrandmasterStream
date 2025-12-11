import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Chrome, Facebook, Apple, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithProvider, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  const handleProviderSignup = async (provider: 'google' | 'facebook' | 'apple') => {
    setError('');
    try {
      await loginWithProvider(provider);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : `Signup with ${provider} failed`);
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
          <h1 className="text-4xl font-bold text-white mb-2">Sign Up</h1>
          <p className="text-gray-400">Join GrandmasterStream and start playing</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full bg-[#262421] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-chess-accent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full bg-[#262421] border border-gray-700 rounded-lg py-2 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-chess-accent transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-chess-accent hover:bg-chess-accentHover disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-500 text-sm">or sign up with</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Social Signup */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleProviderSignup('google')}
            disabled={isLoading}
            className="bg-[#262421] hover:bg-[#302e2b] border border-gray-700 rounded-lg py-2 flex items-center justify-center text-white transition disabled:opacity-50"
            title="Sign up with Google"
          >
            <Chrome size={20} />
          </button>
          <button
            onClick={() => handleProviderSignup('facebook')}
            disabled={isLoading}
            className="bg-[#262421] hover:bg-[#302e2b] border border-gray-700 rounded-lg py-2 flex items-center justify-center text-white transition disabled:opacity-50"
            title="Sign up with Facebook"
          >
            <Facebook size={20} />
          </button>
          <button
            onClick={() => handleProviderSignup('apple')}
            disabled={isLoading}
            className="bg-[#262421] hover:bg-[#302e2b] border border-gray-700 rounded-lg py-2 flex items-center justify-center text-white transition disabled:opacity-50"
            title="Sign up with Apple"
          >
            <Apple size={20} />
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-chess-accent hover:text-chess-accentHover font-semibold transition"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
