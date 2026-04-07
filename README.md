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
| UI | Tailwind CSS v4 + shadcn/ui |
| Email | Resend |
| Calendar | ical-generator + Google Calendar links |
| Validation | Zod + React Hook Form |
| Toasts | Sonner |

## Prerequisites

- Node.js 18+ and npm
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
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase
DATABASE_URL="postgresql://postgres.XXXX:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_XXXX

# Resend
RESEND_API_KEY=re_XXXX

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="your-admin@email.com"
```

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Create database tables

```bash
npx prisma db push
```

> If using the **session pooler**, you can also use `npx prisma migrate dev --name init` for migration-based schema management.

### 5. Seed default data

```bash
npx prisma db seed
```

This creates:
- Default operating hours (Tue-Sun breakfast & lunch, Fri-Sat dinner)
- 3 sections: Indoor (150 seats), Outdoor/Garden (200 seats), Patio (50 seats)

### 6. Create an admin user

In your Supabase dashboard:
1. Go to **Authentication > Users**
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
| `/admin/login` | Admin login |
| `/admin` | Dashboard (today's stats, upcoming bookings) |
| `/admin/bookings` | Bookings list with search, filter by status/date |
| `/admin/bookings/[id]` | Booking detail + status management |
| `/admin/bookings/new` | Manual booking creation |
| `/admin/calendar` | Month view with booking counts |
| `/admin/settings` | Operating hours + special closures |

### API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bookings` | POST | Create a booking |
| `/api/bookings/availability` | GET | Check availability for a date |
| `/api/bookings/[id]` | GET, PATCH | Get/update booking (admin) |
| `/api/bookings/cancel/[token]` | POST | Cancel booking via token |
| `/api/bookings/calendar` | POST | Generate .ics calendar file |
| `/api/admin/settings` | GET, PUT, POST, DELETE | Operating hours & closures CRUD |
| `/api/cron/reminders` | POST | Send 24h reminder emails |

## Project Structure

```
app/
  page.tsx                          Landing page
  book/                             Client booking flow
  admin/                            Admin dashboard & management
  api/                              API routes
components/
  ui/                               shadcn/ui components
  booking/                          Booking wizard components
  admin/                            Admin components
lib/
  db.ts                             Prisma client singleton
  supabase/                         Supabase client/server/middleware helpers
  email/                            Resend email sending + templates
  calendar.ts                       .ics generation + Google Calendar URLs
  booking-utils.ts                  Shared booking utilities
  validators/                       Zod validation schemas
prisma/
  schema.prisma                     Database schema
  seed.ts                           Seed script
generated/
  prisma/                           Generated Prisma client (gitignored)
```

## Operating Hours

| Day | Breakfast | Lunch | Dinner |
|-----|-----------|-------|--------|
| Monday | Closed | Closed | Closed |
| Tuesday - Thursday | 9:00 - 11:30 | 12:00 - 17:30 | -- |
| Friday - Saturday | 9:00 - 11:30 | 12:00 - 17:30 | 18:00 - 22:00 |
| Sunday | 9:00 - 11:30 | 12:00 - 17:30 | -- |

These are configurable from the admin settings page.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (visual DB browser) |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma db seed` | Run seed script |

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Push your repo to GitHub
2. Import the project in Vercel
3. Add all environment variables from `.env.local` to Vercel's Environment Variables settings
4. Set `NEXT_PUBLIC_APP_URL` to your production domain
5. Set up a [Vercel Cron Job](https://vercel.com/docs/cron-jobs) to hit `/api/cron/reminders` daily for 24h booking reminders

## Future Enhancements

- .ics file as email attachment (currently download-only)
- Bulk status updates in admin
- Export bookings to CSV
- SMS notifications via Twilio
- Waitlist management
