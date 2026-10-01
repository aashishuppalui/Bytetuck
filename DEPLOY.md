# Deploy Bytetuck to Vercel

1. Push this folder to a GitHub repo (or use `npm i -g vercel` then `vercel` in this folder).
2. In Vercel: Add New > Project > import the repo > Deploy.
3. Project > Storage > Create > **Blob** > choose **Private** access > connect to the project
   (this adds BLOB_READ_WRITE_TOKEN automatically).
4. Project > Settings > Environment Variables, add:
   - CRON_SECRET = any random string of 16+ characters (`openssl rand -hex 16`)
   - RETENTION_DAYS = 7   (allowed range 5-10)
5. Redeploy (Deployments > ... > Redeploy). The daily cron (03:00 UTC) now deletes files older than RETENTION_DAYS.
6. Check it: Project > Settings > Cron Jobs, and run `/api/cleanup` once from there to see `{"removed":N}`.
7. Add your domain under Settings > Domains. Replace the contact placeholder in the Privacy section of public/index.html.

Notes: Vercel's free Hobby plan is for non-commercial use, so use Pro when you start charging. Hobby cron runs at most once a day, which is fine for day-level retention.
