'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [body, setBody] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchComments();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(display_name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(data ?? []);
  };

  const handleSubmit = async () => {
    if (!body.trim() || !user) return;
    setLoading(true);
    await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      body,
    });
    setBody('');
    await fetchComments();
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    await supabase.from('comments').delete().eq('id', commentId);
    await fetchComments();
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      {comments.length === 0 && (
        <p className="text-gray-400 mb-6">No comments yet. Be the first!</p>
      )}
      {comments.map((c) => (
        <div key={c.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-sm text-gray-600 mb-1">
              {c.profiles?.display_name || 'Anonymous'}
            </p>
            {user && user.id === c.user_id && (
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-500 text-xs hover:text-red-700"
              >
                🗑️ Delete
              </button>
            )}
          </div>
          <p className="text-gray-800">{c.body}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(c.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
      {user ? (
        <div className="mt-6">
          <textarea
            className="w-full border p-3 rounded-lg mb-3"
            rows={3}
            placeholder="Write a comment..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      ) : (
        <p className="mt-6 text-gray-500">
          <a href="/auth/login" className="text-blue-600">Login</a> to leave a comment!
        </p>
      )}
    </div>
  );
}