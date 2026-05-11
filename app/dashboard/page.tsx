import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DeletePost from '@/app/components/DeletePost';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, published, created_at')
    .eq('author', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-black text-violet-400">
          MyBlog
        </a>
        <div className="flex gap-4 items-center">
          <a href="/blog" className="text-gray-400 hover:text-white text-sm">Blog</a>
          <a href="/auth/login" className="text-gray-400 hover:text-white text-sm">Logout</a>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-8 max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back!</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12">
          <a href="/dashboard/new"
            className="bg-violet-600 hover:bg-violet-500 p-6 rounded-2xl text-center font-bold transition-colors">
            Write New Post
          </a>
          <a href="/blog"
            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center font-bold">
            View Blog
          </a>
        </div>

        <h2 className="text-2xl font-black mb-6">My Posts</h2>
        {posts?.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-500 mb-4">No posts yet!</p>
            <a href="/dashboard/new" className="text-violet-400 font-semibold">
              Write your first post
            </a>
          </div>
        )}
        <div className="grid gap-4">
          {posts?.map((post) => (
            <div key={post.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={"/blog/" + post.slug}
                  className="text-violet-400 text-sm px-4 py-2 border border-violet-500/30 rounded-xl hover:bg-violet-500/10 transition-colors">
                  View
                </a>
                <DeletePost postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}