import type { VercelRequest, VercelResponse } from '@vercel/node';
import { api, getServiceClient } from '../server/supabase.js';

export default api(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const supabase = getServiceClient();
  const [{ data: products, error: productsError }, { data: settings, error: settingsError }, { data: categories, error: categoriesError }] = await Promise.all([
    supabase.from('products').select('data').order('created_at', { ascending: true }),
    supabase.from('site_settings').select('content').eq('id', 1).maybeSingle(),
    supabase.from('categories').select('id,name,slug,sort_order').eq('active', true).order('sort_order'),
  ]);
  if (productsError || settingsError || categoriesError) throw productsError || settingsError || categoriesError;
  res.status(200).json({
    products: (products ?? []).map(row => row.data),
    content: settings?.content ?? null,
    categories: categories ?? [],
  });
});
