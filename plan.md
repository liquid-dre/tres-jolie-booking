# Tres Jolie Booking System - Build Progress

## Tech Stack
- **Framework**: Next.js 16.2.2 (App Router), React 19, TypeScript 5
- **Database**: Supabase (Postgres) + Prisma ORM v7 + @prisma/adapter-pg
- **Auth**: Supabase Auth (email/password for admin)
- **UI**: Tailwind CSS v4 + shadcn/ui + Sonner toasts
- **Email**: Resend (HTML templates)
- **Calendar**: ical-generator + Google Calendar links
- **Validation**: Zod
- **Proxy**: Next.js 16 `proxy.ts` for admin route protection

---

## Phase 1: Foundation
- [x] Install all dependencies
- [x] Set up Prisma schema + Supabase connection
- [x] Set up shadcn/ui with Tres Jolie color theme (greens, creams, terracotta)
- [x] Create shared layout components (header, footer, nav)
- [x] Set up Sonner provider in root layout
- [x] Supabase client/server helpers
- [x] Proxy (middleware) for admin auth guard

## Phase 2: Client Booking Flow
- [x] Landing page with restaurant info + "Book a Table" CTA
- [x] Booking wizard (multi-step form)
  - [x] Step 1: Date & party size (calendar picker + counter)
  - [x] Step 2: Time slot selection (grouped by meal period)
  - [x] Step 3: Guest details (name, email, phone, section, children, requests)
  - [x] Step 4: Review & confirm
- [x] Availability API endpoint (`/api/bookings/availability`)
- [x] Create booking API endpoint (`/api/bookings`)
- [x] Confirmation page with "Add to Calendar" buttons

## Phase 3: Email Notifications
- [x] Booking confirmation email (HTML template via Resend)
- [x] Cancellation confirmation email
- [x] Admin alert email on new booking
- [x] Cancellation flow (page + API + email)
- [x] 24h reminder cron endpoint (`/api/cron/reminders`)

## Phase 4: Admin Panel
- [x] Admin login (Supabase Auth email/password)
- [x] Admin layout with sidebar navigation (responsive)
- [x] Dashboard (today's stats, upcoming bookings)
- [x] Bookings list with filters (search, status, date)
- [x] Single booking view + status management (confirm/complete/no-show/cancel)
- [x] Manual booking creation
- [x] Calendar view (month grid + day detail)

## Phase 5: Admin Settings
- [x] Operating hours management (per day/meal period)
- [x] Capacity management (max covers per slot)
- [x] Special closures management (add/remove)

## Phase 6: Calendar Sync & Toasts
- [x] "Add to Calendar" component (Google Calendar link + .ics download)
- [x] .ics generation via ical-generator
- [x] Calendar API endpoint (`/api/bookings/calendar`)
- [x] Sonner toasts on all client actions
- [x] Sonner toasts on all admin actions

## Phase 7: Polish
- [x] SEO metadata + Open Graph
- [x] Build passes cleanly (`npm run build` — 0 errors)
- [x] Seed script for default operating hours + sections

---

## Setup Instructions

1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env` and fill in your Supabase + Resend credentials
3. Run `npx prisma generate` to generate the Prisma client
4. Run `npx prisma migrate dev` to create database tables
5. Run `npx tsx prisma/seed.ts` to seed default operating hours
6. Create an admin user in Supabase Auth dashboard (email/password)
7. Run `npm run dev` to start the development server

## Remaining (future enhancements)
- [ ] Run initial Prisma migration against a live Supabase database
- [ ] Deploy to Vercel with cron job for reminders
- [ ] .ics email attachment (currently download-only)
- [ ] Mobile responsiveness fine-tuning
- [ ] Bulk status updates in admin
- [ ] Export bookings to CSV
