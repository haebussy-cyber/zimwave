import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { api, getServiceClient, readJsonBody, sendError } from '../server/supabase.js';
import type { Product } from '../src/types';

const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const safeImage = (value: unknown): value is string => {
  if (typeof value !== 'string' || value.length > 2048 || value.startsWith('data:')) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
};

function validProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;
  const product = value as Partial<Product>;
  if (typeof product.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(product.id)
    || typeof product.slug !== 'string' || product.slug.length > 160
    || typeof product.name !== 'string' || !product.name.trim() || product.name.length > 180
    || typeof product.brand !== 'string' || product.brand.length > 80
    || typeof product.description !== 'string' || product.description.length > 10000
    || !Array.isArray(product.variants) || product.variants.length < 1 || product.variants.length > 30
    || !Array.isArray(product.galleryImages) || product.galleryImages.length > 30) return false;
  if (!product.variants.every(variant =>
    typeof variant.id === 'string' && variant.id.length <= 100
    && typeof variant.sku === 'string' && variant.sku.length <= 100
    && typeof variant.colorName === 'string' && variant.colorName.length <= 100
    && typeof variant.storage === 'string' && variant.storage.length <= 40
    && Number.isFinite(variant.priceUSD) && variant.priceUSD > 0 && variant.priceUSD <= 100000
    && Number.isInteger(variant.stock) && variant.stock >= 0 && variant.stock <= 100000
    && safeImage(variant.image))) return false;
  return product.galleryImages.every(safeImage);
}

function validContent(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const content = value as Record<string, unknown>;
  return Array.isArray(content.banners) && content.banners.length <= 30
    && content.banners.every(banner => {
      if (!banner || typeof banner !== 'object') return false;
      const item = banner as Record<string, unknown>;
      return typeof item.id === 'string' && typeof item.image === 'string'
        && safeImage(item.image)
        && typeof item.title === 'string' && item.title.length <= 200
        && typeof item.description === 'string' && item.description.length <= 1000
        && (item.href === undefined || (typeof item.href === 'string' && item.href.length <= 2048
          && ((item.href.startsWith('/') && !item.href.startsWith('//')) || /^https:\/\//i.test(item.href))));
    })
    && JSON.stringify(content).length <= 100000;
}

export default api(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }
  const body = readJsonBody(req);
  if (!body || typeof body.action !== 'string') {
    sendError(res, 400, 'An admin action is required.');
    return;
  }

  const supabase = getServiceClient();
  if (body.action === 'load') {
    const [{ data: products, error: productError }, { data: orders, error: orderError },
      { data: categories, error: categoryError }, { data: settings, error: settingsError },
      { data: summary, error: summaryError }] = await Promise.all([
      supabase.from('products').select('data').order('created_at', { ascending: false }),
      supabase.from('orders').select('data,payment_status,fulfillment_status,total_usd,created_at').order('created_at', { ascending: false }).limit(500),
      supabase.from('categories').select('id,name,slug,active,sort_order').order('sort_order'),
      supabase.from('site_settings').select('content,low_stock_threshold').eq('id', 1).maybeSingle(),
      supabase.rpc('admin_store_summary'),
    ]);
    const error = productError || orderError || categoryError || settingsError || summaryError;
    if (error) throw error;
    const orderRows = orders ?? [];
    const productRows = (products ?? []).map(row => row.data as Product);
    const lowStockThreshold = settings?.low_stock_threshold ?? 3;
    res.status(200).json({
      products: productRows,
      orders: orderRows.map(row => ({ ...row.data, paymentStatus: row.payment_status, status: row.fulfillment_status })),
      categories: categories ?? [],
      content: settings?.content ?? null,
      lowStockThreshold,
      summary,
    });
    return;
  }

  if (body.action === 'product.save') {
    if (!validProduct(body.product)) return sendError(res, 400, 'Product data is invalid or includes an unuploaded image.');
    const { data: product, error } = await supabase.rpc('admin_save_product', { p_product: body.product });
    if (error) throw error;
    res.status(200).json({ product });
    return;
  }

  if (body.action === 'product.delete') {
    if (typeof body.id !== 'string') return sendError(res, 400, 'Product id is required.');
    const { error } = await supabase.from('products').delete().eq('id', body.id);
    if (error) throw error;
    res.status(200).json({ ok: true });
    return;
  }

  if (body.action === 'inventory.update') {
    if (typeof body.productId !== 'string' || typeof body.variantId !== 'string'
      || !Number.isInteger(body.quantity) || Number(body.quantity) < 0 || Number(body.quantity) > 100000) {
      return sendError(res, 400, 'Inventory update is invalid.');
    }
    const { data, error } = await supabase.rpc('set_variant_stock', {
      p_product_id: body.productId, p_variant_id: body.variantId, p_quantity: Number(body.quantity),
    });
    if (error) throw error;
    res.status(200).json({ product: data });
    return;
  }

  if (body.action === 'order.status') {
    const allowed = new Set(['confirmed', 'packing', 'dispatching', 'delivered', 'cancelled']);
    if (typeof body.id !== 'string' || typeof body.status !== 'string' || !allowed.has(body.status)) {
      return sendError(res, 400, 'Order status update is invalid.');
    }
    if (body.status === 'cancelled') {
      const { data, error } = await supabase.rpc('cancel_unpaid_order', { p_order_id: body.id });
      if (error) {
        if (error.message.includes('PAID_ORDER_CANNOT_BE_CANCELLED')) return sendError(res, 409, 'Paid orders cannot be cancelled through this flow.');
        if (error.message.includes('ORDER_NOT_FOUND')) return sendError(res, 404, 'Order not found.');
        throw error;
      }
      res.status(200).json({ order: data });
      return;
    }
    const { data: current, error: readError } = await supabase.from('orders').select('data').eq('id', body.id).maybeSingle();
    if (readError) throw readError;
    if (!current) return sendError(res, 404, 'Order not found.');
    const updated = { ...current.data, status: body.status };
    const updates = {
      fulfillment_status: body.status,
      data: updated,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('orders').update(updates).eq('id', body.id);
    if (error) throw error;
    res.status(200).json({ order: updated });
    return;
  }

  if (body.action === 'content.save') {
    if (!validContent(body.content)) return sendError(res, 400, 'Homepage content is invalid or contains an unuploaded image.');
    const { error } = await supabase.from('site_settings').upsert({
      id: 1, content: body.content, updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    res.status(200).json({ content: body.content });
    return;
  }

  if (body.action === 'settings.save') {
    if (!Number.isInteger(body.lowStockThreshold) || Number(body.lowStockThreshold) < 0 || Number(body.lowStockThreshold) > 1000) {
      return sendError(res, 400, 'Low-stock threshold must be between 0 and 1000.');
    }
    const { error } = await supabase.from('site_settings').upsert({
      id: 1, low_stock_threshold: Number(body.lowStockThreshold), updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    res.status(200).json({ lowStockThreshold: Number(body.lowStockThreshold) });
    return;
  }

  if (body.action === 'category.save') {
    if (typeof body.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(body.id)
      || typeof body.name !== 'string' || !body.name.trim() || body.name.length > 100
      || typeof body.slug !== 'string' || !/^[a-z0-9-]{1,120}$/.test(body.slug)
      || !Number.isInteger(body.sortOrder) || Number(body.sortOrder) < 0 || typeof body.active !== 'boolean') {
      return sendError(res, 400, 'Category details are invalid.');
    }
    const { error } = await supabase.rpc('admin_save_category', {
      p_id: body.id, p_name: body.name.trim(), p_slug: body.slug,
      p_sort_order: Number(body.sortOrder), p_active: body.active,
    });
    if (error) throw error;
    res.status(200).json({ ok: true });
    return;
  }

  if (body.action === 'category.delete') {
    if (typeof body.id !== 'string') return sendError(res, 400, 'Category id is required.');
    const { error } = await supabase.rpc('admin_delete_category', { p_id: body.id });
    if (error) {
      if (error.message.includes('CATEGORY_NOT_FOUND')) return sendError(res, 404, 'Category not found.');
      throw error;
    }
    res.status(200).json({ ok: true });
    return;
  }

  if (body.action === 'image.upload') {
    if (typeof body.contentType !== 'string' || !imageMimeTypes.has(body.contentType)
      || typeof body.base64 !== 'string' || body.base64.length > 4_200_000
      || !/^[A-Za-z0-9+/]*={0,2}$/.test(body.base64)) {
      return sendError(res, 400, 'Only JPEG, PNG, or WebP images up to 3 MB are accepted.');
    }
    const buffer = Buffer.from(body.base64, 'base64');
    if (!buffer.length || buffer.length > 3 * 1024 * 1024) return sendError(res, 413, 'Image exceeds the 3 MB limit.');
    const extension = body.contentType === 'image/jpeg' ? 'jpg' : body.contentType.split('/')[1];
    const path = `products/${randomUUID()}.${extension}`;
    const supabaseClient = supabase;
    const { error } = await supabaseClient.storage.from('catalog-images').upload(path, buffer, {
      contentType: body.contentType, cacheControl: '31536000', upsert: false,
    });
    if (error) throw error;
    const { data } = supabaseClient.storage.from('catalog-images').getPublicUrl(path);
    res.status(201).json({ url: data.publicUrl });
    return;
  }

  sendError(res, 400, 'Unknown admin action.');
});
