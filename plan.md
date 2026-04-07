# Tres Jolie Booking System - Build Progress

## Tech Stack
- **Framework**: Next.js 16.2.2 (App Router), React 19, TypeScript 5
- **Database**: Supabase (Postgres) + Prisma ORM
- **Auth**: Supabase Auth (email/password for admin)
- **UI**: Tailwind CSS v4 + shadcn/ui + Sonner toasts
- **Email**: Resend + React Email templates
- **Calendar**: ical-generator + Google Calendar links
- **Validation**: Zod + React Hook Form
- **Date/Time**: date-fns

---

## Phase 1: Foundation
- [ ] Install all dependencies
- [ ] Set up Prisma schema + Supabase connection
- [ ] Run initial migration
- [ ] Set up shadcn/ui with Tres Jolie color theme
- [ ] Create shared layout components (header, footer, nav)
- [ ] Set up Sonner provider in root layout

## Phase 2: Client Booking Flow
- [ ] Landing page with restaurant info + "Book a Table" CTA
- [ ] Booking wizard (multi-step form)
  - [ ] Step 1: Date & party size
  - [ ] Step 2: Time slot selection
  - [ ] Step 3: Guest details
  - [ ] Step 4: Review & confirm
- [ ] Availability API endpoint
- [ ] Create booking API endpoint
- [ ] Confirmation page with "Add to Calendar" buttons

## Phase 3: Email Notifications
- [ ] Set up Resend + React Email
- [ ] Booking confirmation email (with .ics attachment)
- [ ] Cancellation flow (page + API + email)
- [ ] Admin alert email on new booking

## Phase 4: Admin Panel
- [ ] Admin login (Supabase Auth)
- [ ] Admin layout with sidebar navigation
- [ ] Dashboard (today's stats, recent bookings)
- [ ] Bookings list with filters
- [ ] Single booking view + status management
- [ ] Manual booking creation
- [ ] Calendar view

## Phase 5: Admin Settings
- [ ] Operating hours management
- [ ] Section/capacity management
- [ ] Special closures management

## Phase 6: Calendar Sync & Toasts
- [ ] "Add to Calendar" component (Google, Apple, Outlook)
- [ ] .ics attachment in confirmation emails
- [ ] Sonner toasts on all client actions
- [ ] Sonner toasts on all admin actions

## Phase 7: Polish & Cron
- [ ] 24h reminder cron job
- [ ] Mobile responsiveness pass
- [ ] SEO metadata + Open Graph
