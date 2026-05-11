import { createClient } from './supabase/server';

function toSlug(title: string) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getPosts() {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, tags, created_at, profiles(display_name)')
    .eq('published', true)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getPost(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select('*, profiles(display_name)')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  return data;
}

export async function createPost(
  title: string, markdown: string, tags: string[], published = false
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return supabase.from('posts').insert({
    title, slug: toSlug(title), markdown, tags, published, author: user.id
  });
}