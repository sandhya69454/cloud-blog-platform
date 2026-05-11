'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-black text-violet-400">MyBlog</a>
          <h2 className="text-white text-2xl font-bold mt-4">Welcome back!</h2>
          <p className="text-gray-400 mt-2">Login to your account</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="text-gray-400 text-sm font-medium block mb-2">Email</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="text-gray-400 text-sm font-medium block mb-2">Password</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white p-3 rounded-xl font-bold transition-opacity"
          >
            Login
          </button>
          <p className="text-center text-gray-400 mt-4 text-sm">
            <a href="/auth/forgot-password" className="text-violet-400 hover:text-violet-300 font-semibold">
              Forgot password?
            </a>
          </p>
          <p className="text-center text-gray-400 mt-3 text-sm">
            No account?{' '}
            <a href="/auth/signup" className="text-violet-400 hover:text-violet-300 font-semibold">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}