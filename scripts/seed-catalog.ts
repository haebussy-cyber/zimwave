import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../src/data/products';
import { DEFAULT_CONTENT } from '../src/context/ContentContext';

config({ path: '.env.local' });
config();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local before seeding.');
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const categories = [...new Set(PRODUCTS.map(product => product.category || product.brand))].map((name, index) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return { id: `seed-${slug}`, name, slug, sort_order: index };
});

const { error: categoryError } = await supabase.from('categories').upsert(categories, {
  onConflict: 'id', ignoreDuplicates: true,
});
if (categoryError) throw categoryError;

const { error: productError } = await supabase.from('products').upsert(
  PRODUCTS.map(product => ({
    id: product.id, slug: product.slug, category: product.category || product.brand, data: product,
  })),
  { onConflict: 'id', ignoreDuplicates: true },
);
if (productError) throw productError;

const { error: settingsError } = await supabase.from('site_settings').upsert(
  { id: 1, content: DEFAULT_CONTENT },
  { onConflict: 'id', ignoreDuplicates: true },
);
if (settingsError) throw settingsError;

console.log(`Seeded ${PRODUCTS.length} bundled catalogue products and ${categories.length} categories without overwriting existing records.`);
