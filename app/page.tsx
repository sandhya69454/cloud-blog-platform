import { createClient } from '@/lib/supabase/server';
import LogoutButton from '@/app/components/LogoutButton';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, tags, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          ✦ MyBlog
        </a>
        <div className="flex gap-6 items-center">
          <a href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Blog
          </a>
          {user ? (
            <>
              <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Dashboard
              </a>
              <a href="/dashboard/new" className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                ✍️ Write
              </a>
              <LogoutButton />
            </>
          ) : (
            <>
              <a href="/auth/login" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Login
              </a>
              <a href="/auth/signup" className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all">
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-24 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-gray-950 to-pink-900/20 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-block bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            Welcome to MyBlog
          </div>
          <h1 className="text-6xl font-black mb-6 leading-tight">
            Read, Write &{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Inspire
            </span>
          </h1>
          <p className="text-gray-400 text-xl mb-10 max-w-xl mx-auto">
            A beautiful space to share your stories, ideas and experiences with the world.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/blog" className="bg-white text-gray-950 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
              Read Blog
            </a>
            {!user && (
              <a href="/auth/signup" className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
                Start Writing
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Latest Posts */}
      <div className="max-w-4xl mx-auto px-8 pb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black">Latest Posts</h2>
          <a href="/blog" className="text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors">
            View all →
          </a>
        </div>
        {posts?.length === 0 && (
          <p className="text-gray-500">No posts yet!</p>
        )}
        <div className="grid gap-6">
          {posts?.map((post) => (
            <a key={post.id} href={"/blog/" + post.slug}
              className="group block bg-gray-900 border border-gray-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-violet-500/10">
              <h3 className="text-xl font-bold mb-2 group-hover:text-violet-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="flex gap-2 flex-wrap">
                {post.tags?.map((tag: string) => (
                  <span key={tag} className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}