'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DeletePost({ postId }: { postId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;
    await supabase.from('posts').delete().eq('id', postId);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 text-sm px-3 py-1 border border-red-500 rounded hover:bg-red-50"
    >
      🗑️ Delete
    </button>
  );
}