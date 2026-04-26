# LocalLoop — Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL (local, Neon, or Supabase)
- npm

---

## 1. Clone & Install

```bash
cd localloop
npm install
```

---

## 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random 32+ char secret |
| `NEXTAUTH_URL` | `http://localhost:3000` |

### Optional (for full features)

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth (signup with Google) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `RAZORPAY_KEY_ID` | Razorpay payments (placeholder) |

---

## 3. Setup Database

### Option A — Local PostgreSQL

```bash
createdb localloop
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/localloop"' >> .env
```

### Option B — Neon (free cloud Postgres)

1. Go to [neon.tech](https://neon.tech), create a project
2. Copy the connection string to `DATABASE_URL` in `.env`

### Option C — Supabase

1. Go to [supabase.com](https://supabase.com), create a project
2. Settings → Database → Connection string → copy URI to `DATABASE_URL`

---

## 4. Push Schema & Seed

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed demo data
```

---

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@localloop.in | Admin@123 |
| Partner 1 | raju.prints@localloop.in | Partner@123 |
| Partner 2 | sunrise.cyber@localloop.in | Partner@123 |
| Customer | amit.kumar@gmail.com | Customer@123 |
| Delivery Agent | rajesh.delivery@localloop.in | Agent@123 |

---

## App Routes

| URL | Description |
|---|---|
| `/` | Landing page |
| `/services` | Browse service partners |
| `/services/[id]` | Partner detail + order form |
| `/orders` | Customer order history |
| `/orders/[id]` | Order tracking |
| `/login` | Sign in |
| `/signup` | Register |
| `/partner/dashboard` | Partner dashboard |
| `/partner/orders` | Partner order queue |
| `/partner/services` | Partner service catalog |
| `/partner/earnings` | Partner earnings |
| `/delivery/dashboard` | Delivery agent panel |
| `/admin` | Admin dashboard |
| `/admin/partners` | Partner management |
| `/admin/orders` | All orders monitoring |
| `/admin/users` | User management |
| `/admin/services` | Category management |
