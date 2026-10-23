import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export type ApiHandler = (req: VercelRequest, res: VercelResponse) => Promise<void>;

let serviceClient: SupabaseClient | undefined;

export function getServiceClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server configuration is missing.');
  serviceClient ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return serviceClient;
}

export function sendError(res: VercelResponse, status: number, message: string): void {
  res.status(status).json({ error: message });
}

export function api(handler: ApiHandler): ApiHandler {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error
        ? Number((error as { statusCode: unknown }).statusCode)
        : 500;
      if (statusCode === 401 || statusCode === 403) {
        sendError(res, statusCode, error instanceof Error ? error.message : 'Authorization failed.');
        return;
      }
      console.error('API request failed', error);
      sendError(res, 500, 'The request could not be completed.');
    }
  };
}

export function readJsonBody(req: VercelRequest): Record<string, unknown> | null {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return null;
  return req.body as Record<string, unknown>;
}
