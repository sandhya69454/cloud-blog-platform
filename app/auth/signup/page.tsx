'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    if (error) setError(error.message);
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-black text-violet-400">MyBlog</a>
          <h2 className="text-white text-2xl font-bold mt-4">Create account</h2>
          <p className="text-gray-400 mt-2">Join our community of writers</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="text-gray-400 text-sm font-medium block mb-2">Full Name</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:border-violet-500"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm font-medium block mb-2">Email</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:border-violet-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="text-gray-400 text-sm font-medium block mb-2">Password</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:border-violet-500"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white p-3 rounded-xl font-bold"
          >
            Create Account
          </button>
          <p className="text-center text-gray-400 mt-6 text-sm">
            Have an account?{' '}
            <a href="/auth/login" className="text-violet-400 font-semibold">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}