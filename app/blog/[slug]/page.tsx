import { createClient } from '@/lib/supabase/server';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Comments from '@/app/components/Comments';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, markdown')
    .eq('slug', slug)
    .single();
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.markdown.slice(0, 160),
  };
}

export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(display_name)')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-black text-violet-400">
          MyBlog
        </a>
        <a href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">
          Back to Blog
        </a>
      </nav>

      <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto">
        {/* Post Header */}
        <div className="mb-10">
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>By <span className="text-violet-400">{post.profiles?.display_name || 'Anonymous'}</span></span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-10" />

        {/* Post Content */}
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-black
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300
          prose-strong:text-white
          prose-code:text-pink-400 prose-code:bg-gray-900 prose-code:px-1 prose-code:rounded
          prose-img:rounded-2xl prose-img:border prose-img:border-gray-800">
          <ReactMarkdown>{post.markdown}</ReactMarkdown>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12" />

        {/* Comments */}
        <Comments postId={post.id} />
      </div>
    </div>
  );
}