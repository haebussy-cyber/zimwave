import type { VercelRequest, VercelResponse } from '@vercel/node';
import { api, getServiceClient, readJsonBody, sendError } from '../server/supabase';

const allowedMethods = new Set(['ecocash', 'paynow', 'onemoney', 'cod', 'store-pay']);
const allowedDelivery = new Set([
  'harare-same-day', 'chitungwiza-same-day', 'provincial-courier',
  'store-pickup-eastgate', 'store-pickup-avondale', 'store-pickup-bulawayo',
]);

export default api(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }
  const body = readJsonBody(req);
  if (!body || typeof body.customerName !== 'string' || typeof body.customerPhone !== 'string'
    || !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 20
    || typeof body.deliveryMethod !== 'string' || !allowedDelivery.has(body.deliveryMethod)
    || typeof body.paymentMethod !== 'string' || !allowedMethods.has(body.paymentMethod)) {
    sendError(res, 400, 'Order details are incomplete or invalid.');
    return;
  }
  if (body.customerName.trim().length < 2 || body.customerName.length > 120
    || body.customerPhone.trim().length < 7 || body.customerPhone.length > 30) {
    sendError(res, 400, 'Enter a valid customer name and phone number.');
    return;
  }

  const items = body.items.map((item: unknown) => {
    if (!item || typeof item !== 'object') return null;
    const value = item as Record<string, unknown>;
    if (typeof value.productId !== 'string' || typeof value.variantId !== 'string'
      || !Number.isInteger(value.quantity) || Number(value.quantity) < 1 || Number(value.quantity) > 20) return null;
    return { productId: value.productId, variantId: value.variantId, quantity: Number(value.quantity) };
  });
  if (items.some(item => !item)) {
    sendError(res, 400, 'One or more cart items are invalid.');
    return;
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase.rpc('place_customer_order', {
    p_order: {
      customer_name: body.customerName.trim(),
      customer_phone: body.customerPhone.trim(),
      customer_email: typeof body.customerEmail === 'string' ? body.customerEmail.trim().slice(0, 254) : null,
      delivery_city: typeof body.deliveryCity === 'string' ? body.deliveryCity.trim().slice(0, 80) : '',
      delivery_address: typeof body.deliveryAddress === 'string' ? body.deliveryAddress.trim().slice(0, 500) : '',
      delivery_method: body.deliveryMethod,
      payment_method: body.paymentMethod,
      payment_phone: typeof body.paymentPhone === 'string' ? body.paymentPhone.trim().slice(0, 30) : null,
      items,
    },
  });
  if (error) {
    if (error.message.includes('INSUFFICIENT_STOCK')) {
      sendError(res, 409, 'A selected item is no longer available in that quantity. Refresh the catalogue and try again.');
      return;
    }
    throw error;
  }
  res.status(201).json({ order: data });
});
