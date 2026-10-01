// "Delete now": lets a user erase their own files immediately (URLs are unguessable).
import { del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const urls = Array.isArray(req.body?.urls) ? req.body.urls.slice(0, 4) : [];
  const ok = urls.filter(u => {
    try { const x = new URL(u); return x.protocol === 'https:' && x.hostname.endsWith('.blob.vercel-storage.com') && x.pathname.startsWith('/uploads/'); }
    catch { return false; }
  });
  if (ok.length) await del(ok);
  res.status(200).json({ deleted: ok.length });
}
