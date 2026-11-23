import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QuillIcon } from '../assets/assets';

export default function AuthModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setLocalError('Name is required');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setLocalError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      onClose();
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#DDD7CD] rounded-3xl w-full max-w-sm p-7 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#555] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EBE5DB] border border-[#D5CDC1] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <QuillIcon className="w-6 h-6 text-[#2A3C4D]" color="#2A3C4D" />
          </div>
          <h2 className="font-serif font-bold text-xl text-[#2B2824] uppercase tracking-wider">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#736E67] mt-1">
            {isRegister ? 'Join the Creative Writer’s Hub' : 'Enter your Taskflow digital journal'}
          </p>
        </div>

        {localError && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
            {localError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-[#403B35] mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Author Name"
                  required={isRegister}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#403B35] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="writer@example.com"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#403B35] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#283845] hover:bg-[#1E2B35] text-white text-xs font-semibold shadow-md transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register & Enter Hub' : 'Sign In'}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-5 text-center pt-4 border-t border-[#E5E0D7]">
          <p className="text-xs text-[#6B655D]">
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setLocalError('');
              }}
              className="text-[#2A3C4D] font-bold hover:underline ml-1"
            >
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
