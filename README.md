# Tres Jolie Booking System

A modern, responsive restaurant booking web application for [Tres Jolie](https://www.tresjolie.co.za/restaurant) — a 400-seat Mediterranean/South African country restaurant in Ruimsig, Johannesburg.

Guests can book online with real-time availability, receive email confirmations with calendar sync, and cancel via a secure link. Staff manage everything through an admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | Supabase (hosted Postgres) |
| ORM | Prisma v7 with `@prisma/adapter-pg` |
| Auth | Supabase Auth (email/password for admin) |
| UI | Tailwind CSS v4 + shadcn/ui (Base UI) |
| Email | Resend |
| Calendar | ical-generator + Google Calendar links |
| Validation | Zod + React Hook Form |
| Toasts | Sonner |
| Animations | Framer Motion |

## Prerequisites

- **Node.js 18+** and npm
- A [Supabase](https://supabase.com) account (free tier works)
- A [Resend](https://resend.com) account (free tier: 100 emails/day)

## Getting Your API Keys

### Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. **Database URL** — Go to **Settings > Database > Connection string**
   - Select **Session pooler** (recommended for Prisma migrations)
   - Copy the URI and replace `[YOUR-PASSWORD]` with your database password
   - Format: `postgresql://postgres.XXXX:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres`
3. **Supabase URL** — Go to **Settings > API**
   - Copy the **Project URL** (e.g. `https://XXXX.supabase.co`)
4. **Publishable Key** — On the same API page
   - Copy the **Publishable Default Key** (starts with `sb_publishable_`)
5. **Service Role Key** — On the same API page
   - Copy the **`service_role` secret key** (required for admin user management)
   - This key bypasses Row Level Security and must never be exposed to the browser

### Resend

1. Go to [resend.com](https://resend.com) and create an account
2. Go to **API Keys** in the dashboard
3. Click **Create API Key** and copy the key (starts with `re_`)
4. For production: add and verify your sending domain under **Domains**

## Setup

### 1. Clone and install

```bash
git clone https://github.com/liquid-dre/tres-jolie-booking.git
cd tres-jolie-booking
npm install --legacy-peer-deps
```

> **Note:** `--legacy-peer-deps` is needed due to a peer dependency conflict with the `dayzed` package.

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase
DATABASE_URL="postgresql://postgres.XXXX:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://XXXX.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="sb_publishable_XXXX"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Resend (Email)
RESEND_API_KEY="re_XXXX"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="your-admin@email.com"
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string from Supabase (use session pooler for migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/public key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only, for admin user management) |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL (used in email links) |
| `ADMIN_EMAIL` | Email address that receives admin alert notifications |

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Create database tables

```bash
npx prisma db push
```

> Alternatively, use `npx prisma migrate dev` for migration-based schema management (recommended for production).

### 5. Seed default data

```bash
npx prisma db seed
```

This creates:
- Default operating hours (Tue-Sun breakfast & lunch, Fri-Sat dinner)
- 3 sections: Indoor (150 seats), Outdoor/Garden (200 seats), Patio (50 seats)

### 6. Create an admin user

You have two options:

**Option A — Via the Admin Panel (recommended):**
If you already have one admin user, go to `/admin/users` and create additional admins through the UI.

**Option B — Via Supabase Dashboard:**
1. Go to **Authentication > Users** in your Supabase dashboard
2. Click **Add User > Create New User**
3. Enter an email and password — this will be your admin login

### 7. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

### Client-Facing

| Route | Description |
|-------|-------------|
| `/` | Landing page with restaurant info and "Book a Table" CTA |
| `/book` | 4-step booking wizard (date, time, details, review) |
| `/book/confirmation/[ref]` | Booking confirmation with calendar sync buttons |
| `/book/cancel/[token]` | Cancellation page (from email link) |

### Admin (requires login)

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login page |
| `/admin` | Dashboard with today's stats and upcoming bookings |
| `/admin/bookings` | Bookings list with search, filter by status/date, eye icon for quick view |
| `/admin/bookings/[id]` | Booking detail + status management |
| `/admin/bookings/new` | Manual booking creation |
| `/admin/calendar` | Month view with daily booking counts |
| `/admin/menu` | Menu categories and items management (add/edit/delete/reorder) |
| `/admin/settings` | Operating hours (add/edit/delete slots per day) + special closures (one-time & recurring) |
| `/admin/users` | Admin user management (create/delete admin accounts) |

### API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bookings` | POST | Create a booking |
| `/api/bookings/availability` | GET | Check availability for a date (handles recurring closures) |
| `/api/bookings/[id]` | GET, PATCH | Get/update booking (admin) |
| `/api/bookings/cancel/[token]` | POST | Cancel booking via token |
| `/api/bookings/calendar` | POST | Generate .ics calendar file |
| `/api/admin/settings` | GET, PUT, POST, DELETE | Operating hours & closures CRUD |
| `/api/admin/menu` | GET, POST, PUT, DELETE | Menu categories & items CRUD |
| `/api/admin/users` | GET, POST, DELETE | Admin user management (requires service role key) |
| `/api/cron/reminders` | POST | Send 24h reminder emails |

## Project Structure

```
app/
  page.tsx                          Landing page
  book/                             Client booking flow
  admin/                            Admin dashboard & management
    bookings/                       Booking list, detail, creation
    calendar/                       Monthly calendar view
    menu/                           Menu management
    settings/                       Operating hours & closures
    users/                          Admin user management
  api/                              API routes
    bookings/                       Booking CRUD & availability
    admin/                          Admin APIs (settings, menu, users)
    cron/                           Scheduled tasks
components/
  ui/                               shadcn/ui components
  booking/                          Booking wizard components
  admin/                            Admin components (sidebar, filters)
  shared/                           Shared components (header, footer, editorial)
lib/
  db.ts                             Prisma client singleton
  supabase/
    client.ts                       Browser Supabase client
    server.ts                       Server Supabase client (with cookies)
    admin.ts                        Service role Supabase client (for admin API)
    middleware.ts                    Auth middleware helper
  email/                            Resend email sending + templates
  calendar.ts                       .ics generation + Google Calendar URLs
  booking-utils.ts                  Shared booking utilities
  validators/                       Zod validation schemas
prisma/
  schema.prisma                     Database schema
  seed.ts                           Seed script
  migrations/                       Database migrations
generated/
  prisma/                           Generated Prisma client (gitignored)
```

## Operating Hours (Defaults)

| Day | Breakfast | Lunch | Dinner |
|-----|-----------|-------|--------|
| Monday | Closed | Closed | Closed |
| Tuesday - Thursday | 9:00 - 11:30 | 12:00 - 17:30 | -- |
| Friday - Saturday | 9:00 - 11:30 | 12:00 - 17:30 | 18:00 - 22:00 |
| Sunday | 9:00 - 11:30 | 12:00 - 17:30 | -- |

These are fully configurable from the admin settings page. Admins can add or remove meal slots (breakfast, lunch, dinner) for any day of the week.

## Special Closures

Closures can be configured as:
- **One-time** — specific date (e.g. "2026-12-25 — Christmas Day")
- **Recurring** — repeats on a schedule:
  - **Weekly** — same day of the week
  - **Monthly** — same day of the month
  - **Yearly** — same month and day each year

The availability API automatically checks both one-time and recurring closures.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Generate Prisma client + production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (visual DB browser) |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma migrate dev` | Run migrations in development |
| `npx prisma db seed` | Run seed script |

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Push your repo to GitHub
2. Import the project in Vercel
3. Add all environment variables from `.env.local` to Vercel's Environment Variables settings
4. Set `NEXT_PUBLIC_APP_URL` to your production domain
5. Set up a [Vercel Cron Job](https://vercel.com/docs/cron-jobs) to hit `/api/cron/reminders` daily for 24h booking reminders

> **Important:** Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in your production environment for admin user management to work.
