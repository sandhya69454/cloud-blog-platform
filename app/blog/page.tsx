import { createClient } from '@/lib/supabase/server';

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, tags, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          ✦ MyBlog
        </a>
        <div className="flex gap-6 items-center">
          <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a>
          <a href="/auth/login" className="text-gray-400 hover:text-white transition-colors text-sm">Login</a>
          <a href="/auth/signup" className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-5 py-2 rounded-full text-sm font-semibold">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-32 pb-12 px-8 text-center">
        <h1 className="text-5xl font-black mb-4">
          All{' '}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Posts
          </span>
        </h1>
        <p className="text-gray-400">Explore all our stories and ideas</p>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-8 pb-24">
        {posts?.length === 0 && (
          <p className="text-gray-500 text-center">No posts yet!</p>
        )}
        <div className="grid gap-6">
          {posts?.map((post) => (
            <a key={post.id} href={"/blog/" + post.slug}
              className="group block bg-gray-900 border border-gray-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-violet-500/10">
              <h2 className="text-2xl font-bold mb-2 group-hover:text-violet-400 transition-colors">
                {post.title}
              </h2>
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