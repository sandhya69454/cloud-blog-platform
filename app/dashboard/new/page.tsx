'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/auth/login');
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const { error } = await supabase.from('posts').insert({
      title, slug, markdown,
      tags: tags.split(',').map(t => t.trim()),
      published, author: user.id
    });
    if (error) setError(error.message);
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-black text-violet-400">
          MyBlog
        </a>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
          Back to Dashboard
        </a>
      </nav>

      <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-2">Write New Post</h1>
        <p className="text-gray-400 mb-10">Share your story with the world</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="text-gray-400 text-sm font-medium block mb-2">Post Title</label>
          <input
            className="w-full bg-gray-900 border border-gray-800 focus:border-violet-500 text-white p-4 rounded-xl focus:outline-none transition-colors text-lg font-semibold"
            placeholder="Enter your post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-sm font-medium block mb-2">Content (Markdown)</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-800 focus:border-violet-500 text-white p-4 rounded-xl focus:outline-none transition-colors h-72 resize-none font-mono text-sm"
            placeholder="Write your post content in Markdown..."
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-sm font-medium block mb-2">Tags</label>
          <input
            className="w-full bg-gray-900 border border-gray-800 focus:border-violet-500 text-white p-4 rounded-xl focus:outline-none transition-colors"
            placeholder="tech, news, design (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 mb-8 bg-gray-900 border border-gray-800 p-4 rounded-xl">
          <input
            type="checkbox"
            id="publish"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 accent-violet-500"
          />
          <label htmlFor="publish" className="text-gray-300 font-medium cursor-pointer">
            Publish immediately
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white p-4 rounded-xl font-bold text-lg transition-opacity"
        >
          Save Post
        </button>
      </div>
    </div>
  );
}