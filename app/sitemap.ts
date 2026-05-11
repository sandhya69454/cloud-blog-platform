import { createClient } from '@/lib/supabase/server';
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at, created_at')
    .eq('published', true);

  const postEntries = posts?.map((post) => ({
    url: SITE_URL + '/blog/' + post.slug,
    lastModified: new Date(post.updated_at ?? post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) ?? [];

  return [
    { url: SITE_URL, lastModified: new Date(), priority: 1 },
    { url: SITE_URL + '/blog', lastModified: new Date(), priority: 0.9 },
    ...postEntries,
  ];
}