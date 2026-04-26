# LocalLoop — Deployment Guide

## Recommended: Vercel + Neon (Free Tier available)

---

## 1. Database — Neon

1. Create account at [neon.tech](https://neon.tech)
2. Create a project → copy `Connection string`
3. Use this as `DATABASE_URL`

---

## 2. Deploy to Vercel

### Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Via Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Framework**: Next.js
4. Add environment variables (see below)
5. Click Deploy

### Required Environment Variables on Vercel

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=... (optional)
GOOGLE_CLIENT_SECRET=... (optional)
```

---

## 3. Post-Deploy: Run Migrations

After first deploy, run:

```bash
npx prisma db push
npx prisma db seed
```

Or add a build command in `package.json`:
```json
"build": "prisma generate && next build"
```

---

## 4. Custom Domain

In Vercel dashboard → Settings → Domains → Add custom domain.

---

## Alternative: Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add PostgreSQL plugin
4. Set environment variables
5. Deploy

---

## Production Checklist

- [ ] `NEXTAUTH_SECRET` is a strong 32+ char random string
- [ ] `DATABASE_URL` points to production DB
- [ ] Google OAuth redirect URIs updated to production URL
- [ ] Razorpay webhook URL configured (when going live)
- [ ] File storage configured (UploadThing or AWS S3) for document uploads
- [ ] HTTPS enforced (automatic on Vercel)
