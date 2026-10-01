// Daily cron: permanently deletes every stored file older than RETENTION_DAYS (5-10, default 7).
import { list, del } from '@vercel/blob';

const DAYS = Math.min(10, Math.max(5, Number(process.env.RETENTION_DAYS) || 7));

export default async function handler(req, res) {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }
  const cutoff = Date.now() - DAYS * 864e5;
  let cursor, removed = 0;
  do {
    const page = await list({ prefix: 'uploads/', cursor, limit: 1000 });
    const old = page.blobs.filter(b => new Date(b.uploadedAt).getTime() < cutoff).map(b => b.url);
    if (old.length) { await del(old); removed += old.length; }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  res.status(200).json({ removed, retentionDays: DAYS });
}
