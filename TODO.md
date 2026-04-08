# Tres Jolie Booking System — Task Tracker

## Completed

### Core Booking System
- [x] 4-step booking wizard (date selection, time/party, guest details, review)
- [x] Real-time availability checking against operating hours and capacity
- [x] Party size validation (1-20 guests, children count)
- [x] Section preference selection (Indoor, Outdoor, No Preference)
- [x] Special requests text field
- [x] Booking reference generation
- [x] Cancel-via-link with secure token

### Email Notifications
- [x] Booking confirmation email with details
- [x] Cancellation confirmation email
- [x] Admin alert email on new bookings
- [x] 24-hour reminder email (via cron endpoint)
- [x] Fix email `from` address to use verified Resend domain

### Calendar Integration
- [x] .ics file download for calendar import
- [x] Google Calendar link generation
- [x] Calendar sync buttons on confirmation page

### Admin Dashboard
- [x] Login with Supabase Auth (email/password)
- [x] Dashboard with today's stats (total bookings, guests, upcoming)
- [x] Upcoming bookings list on dashboard

### Admin Bookings Management
- [x] Bookings list with table view
- [x] Search by guest name, email, or reference
- [x] Filter by status (Confirmed, Cancelled, No Show, Completed, Waitlisted)
- [x] Filter by date
- [x] Booking detail page with full guest info
- [x] Status management (update booking status)
- [x] Admin notes on bookings
- [x] Manual booking creation by admin
- [x] Eye icon on each booking row for quick detail access

### Admin Calendar
- [x] Month view calendar with daily booking counts
- [x] Click-through to filtered bookings list

### Admin Menu Management
- [x] Menu categories CRUD (create, rename, delete, reorder)
- [x] Menu items CRUD within categories (add, edit, delete, reorder)
- [x] Toggle item active/inactive
- [x] "Add Item" button positioned at top of each category for easy access
- [x] Duplicate item name detection across all categories (client + server-side)

### Admin Settings
- [x] Operating hours display and editing per day
- [x] Save hours with max covers per slot
- [x] Add new meal slots (breakfast, lunch, dinner) to any day
- [x] Delete meal slots from any day
- [x] Default time pre-fill when adding slots (breakfast 09:00-11:30, lunch 12:00-17:30, dinner 18:00-22:00)
- [x] Special closures — add with date and reason
- [x] Special closures — delete
- [x] Recurring closures (weekly, monthly, yearly)
- [x] Recurring closure enforcement in availability API

### Admin User Management
- [x] List all admin users (email, created date)
- [x] Create new admin users (email + password)
- [x] Delete admin users with confirmation
- [x] Guard: cannot delete the last admin account
- [x] Users nav item in admin sidebar

### UI/UX
- [x] Responsive design (mobile, tablet, desktop)
- [x] Landing page with hero section, restaurant info, and CTAs
- [x] Hero image with brightness and gradient overlay for text legibility
- [x] Editorial design elements (ornaments, grid lines)
- [x] Dark/light theme support (next-themes)
- [x] Animated transitions (Framer Motion)
- [x] Toast notifications (Sonner)
- [x] Red field highlighting on validation errors
- [x] Phone input with country code selector
- [x] Date picker component

### Infrastructure
- [x] Prisma schema with full data model
- [x] Database migrations (init, menu models, recurring closures)
- [x] Seed script for default operating hours and sections
- [x] Supabase Auth middleware for admin route protection
- [x] Environment variable configuration

---

## Not Done / Future Enhancements

### Booking Features
- [ ] .ics file as email attachment (currently download-only from confirmation page)
- [ ] SMS notifications via Twilio
- [ ] Waitlist management (auto-promote when cancellations free up space)
- [ ] Guest account / login for returning customers
- [ ] Booking modification (change date/time/party size without cancelling)
- [ ] Multi-language support

### Admin Features
- [ ] Bulk status updates in admin bookings list
- [ ] Export bookings to CSV/Excel
- [ ] Admin activity/audit log
- [ ] Admin roles and permissions (owner vs. staff)
- [ ] Email template customization from admin panel
- [ ] Revenue/analytics dashboard (covers per day, popular times, no-show rates)
- [ ] Table/seating assignment and floor plan management

### Menu
- [ ] Menu item images/photos
- [ ] Dietary tags (vegetarian, vegan, gluten-free, halal)
- [ ] Allergen information
- [ ] Seasonal/limited-time menu item scheduling
- [ ] Public-facing menu page (currently admin-only)

### Technical
- [ ] Unit and integration tests
- [ ] E2E tests (Playwright or Cypress)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Rate limiting on public API endpoints
- [ ] Image optimization (Next.js `<Image>` component for hero/about images)
- [ ] Fix pre-existing TypeScript error in `components/ui/phone-input.tsx` (base-ui Select type mismatch)
- [ ] Upgrade `dayzed` package or replace to resolve React 19 peer dependency conflict
- [ ] PWA support for admin (offline-capable, installable)
- [ ] Database backups and monitoring

### Deployment
- [ ] Production deployment guide (Vercel + custom domain)
- [ ] Vercel Cron Job setup for reminders
- [ ] Resend domain verification for production emails
- [ ] Environment-specific configuration (staging vs. production)
