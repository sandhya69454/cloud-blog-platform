'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/auth/reset-password',
    });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-black text-violet-400">
            MyBlog
          </a>
          <h2 className="text-white text-2xl font-bold mt-4">Forgot Password</h2>
          <p className="text-gray-400 mt-2">We will send you a reset link</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-white font-bold text-xl mb-2">Email Sent!</h3>
              <p className="text-gray-400 mb-6">
                Check your inbox for the password reset link!
              </p>
              <a href="/auth/login"
                className="text-violet-400 hover:text-violet-300 font-semibold">
                Back to Login
              </a>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}
              <div className="mb-6">
                <label className="text-gray-400 text-sm font-medium block mb-2">Email</label>
                <input
                  className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white p-3 rounded-xl font-bold transition-opacity"
              >
                Send Reset Link
              </button>
              <p className="text-center text-gray-400 mt-6 text-sm">
                Remember password?{' '}
                <a href="/auth/login" className="text-violet-400 hover:text-violet-300 font-semibold">
                  Login
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}