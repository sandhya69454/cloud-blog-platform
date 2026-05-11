import { createClient } from '@/lib/supabase/client';

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop();
  const path = Date.now() + '.' + ext;
  
  const { error } = await supabase.storage
    .from('post-images')
    .upload(path, file);
    
  if (error) throw error;
  
  const { data } = supabase.storage
    .from('post-images')
    .getPublicUrl(path);
    
  return data.publicUrl;
}