# Tres Jolie Booking — User Guide

A practical, end-to-end walkthrough of the Tres Jolie online booking system: what it does, how guests use it, and how restaurant staff run the floor with it.

> **Tres Jolie** is a 400-seat Mediterranean / South African country restaurant in Ruimsig, Johannesburg. This system replaces phone-only reservations with a real-time, self-serve experience for guests and a single control panel for the team.

---

## Table of Contents

1. [Why This System Exists](#why-this-system-exists)
2. [At a Glance — Feature Overview](#at-a-glance--feature-overview)
3. [For Guests — Booking a Table](#for-guests--booking-a-table)
4. [For Guests — Managing Your Booking](#for-guests--managing-your-booking)
5. [For Staff — The Admin Dashboard](#for-staff--the-admin-dashboard)
6. [Operating Hours & Closures](#operating-hours--closures)
7. [Menu Management](#menu-management)
8. [Analytics](#analytics)
9. [Admin User Management](#admin-user-management)
10. [Notifications & Reminders](#notifications--reminders)
11. [Tips & Best Practices](#tips--best-practices)
12. [Frequently Asked Questions](#frequently-asked-questions)

---

## Why This System Exists

| Benefit | What it means in practice |
|---|---|
| **Bookings happen 24/7** | Guests reserve a table at midnight without anyone picking up the phone. |
| **No double-bookings** | Capacity is checked live against indoor (150), outdoor (200) and patio (50) seats. |
| **Less admin time** | Confirmation emails, calendar invites and reminders are fully automated. |
| **One source of truth** | Phone-in reservations and online bookings sit in the same dashboard. |
| **Guest self-service** | Cancellations happen via a secure link — no awkward phone calls. |
| **Data to act on** | Analytics reveal which days, sections and meal periods drive revenue. |
| **Works on any device** | Fully responsive — guests can book from a phone in under a minute. |

---

## At a Glance — Feature Overview

**For diners**
- 4-step booking wizard (date → time → details → review)
- Real-time availability that respects operating hours and closures
- Section preference: Indoor, Outdoor/Garden, or No Preference
- Email confirmation with `.ics` attachment and "Add to Google Calendar" button
- 24-hour reminder email
- One-click cancellation via secure token link

**For staff**
- Dashboard with today's covers and upcoming bookings
- Full bookings list with search, status filters and date filters
- Manual booking creation for walk-ins and phone reservations
- Booking detail view with status workflow (Pending → Confirmed → Seated → Completed / Cancelled / No-Show)
- Monthly calendar view with daily cover counts
- Menu manager (categories + items, with drag-to-reorder)
- Operating-hours editor (per day, per meal period)
- One-time and recurring closures (e.g. public holidays, weekly day off)
- Analytics across 7 / 30 / 90-day windows
- Multi-admin support with secure invite/remove

---

## For Guests — Booking a Table

The public booking flow lives at `/book` and takes about 60 seconds.

### Step 1 — Date & Party Size
- Pick a date from the calendar (the system skips Mondays by default since the restaurant is closed).
- Choose how many guests will be dining.
- Closed days and fully-booked days are automatically blocked.

### Step 2 — Time Slot
- Available meal periods (Breakfast, Lunch, Dinner) appear based on the day chosen.
- Each period shows specific available times. Unavailable times are hidden — guests can only pick what's actually possible.

### Step 3 — Guest Details
- Full name
- Email address (where the confirmation goes)
- Phone number
- Section preference: **Indoor**, **Outdoor / Garden**, or **No Preference**
- Number of children in the party (helps with high chairs and kids' menu prep)
- Special requests (allergies, anniversaries, accessibility, etc.)

### Step 4 — Review & Confirm
- A summary screen shows everything the guest entered.
- Hitting **Confirm Booking** creates the reservation and redirects to a confirmation page.

### After Confirming
- A confirmation email arrives within seconds, including:
  - Booking reference number
  - Date, time, party size and section preference
  - A "Cancel Booking" link unique to that reservation
  - An `.ics` attachment that imports straight into Apple Calendar / Outlook
  - A one-click **Add to Google Calendar** button

---

## For Guests — Managing Your Booking

### Cancelling
1. Open the confirmation email.
2. Click **Cancel Booking**.
3. The cancellation page (`/book/cancel/[token]`) asks for a final confirmation.
4. Once confirmed, the seat is immediately released and the restaurant is notified.

The token in the link is single-use and tied to one booking — it cannot be guessed or reused.

### Adding to Calendar
On the confirmation page (`/book/confirmation/[ref]`):
- **Add to Google Calendar** — opens Google Calendar pre-filled.
- **Download .ics** — works for Apple Calendar, Outlook and most other calendar apps.

### Reminder Email
24 hours before the reservation, a friendly reminder lands in the guest's inbox with the cancel link still attached, so anyone who can't make it can free up the table.

---

## For Staff — The Admin Dashboard

Admins log in at `/admin/login` with the email and password issued to them.

### `/admin` — Today's Overview
The landing dashboard shows:
- Today's total covers
- Upcoming bookings sorted by time
- Quick links to the busier areas of the app

### `/admin/bookings` — All Reservations
- **Search** by guest name, email or reference.
- **Filter** by status: Pending, Confirmed, Seated, Completed, Cancelled, No-Show.
- **Filter** by date or date range.
- **Eye icon** next to a row opens a quick-view summary without leaving the list.
- Click a row to open the full booking page.

### `/admin/bookings/[id]` — Booking Detail
From this page staff can:
- Read all guest details and special requests
- Move the booking through its status workflow
- Edit covers, time, or section if the guest calls back to change something
- Cancel on the guest's behalf

### `/admin/bookings/new` — Manual Booking
For phone-in and walk-in reservations. Identical fields to the public wizard, but completed by staff. Useful for repeat regulars who don't want to use the website.

### `/admin/bookings/print` — Print View
A printer-friendly run sheet for the floor manager at the start of service.

### `/admin/calendar` — Month View
- Calendar grid with a cover count badge on each day.
- Click a day to drill into that day's bookings list.
- Great for spotting unusually busy / quiet days at a glance.

---

## Operating Hours & Closures

Both live at **`/admin/settings`**.

### Operating Hours
Each day of the week can have any of three meal periods, each with its own start and end time:

| Period | Default range |
|---|---|
| Breakfast | 09:00 – 11:30 |
| Lunch | 12:00 – 17:30 |
| Dinner | 18:00 – 22:00 (Fri & Sat only by default) |

Admins can **add**, **edit**, **delete** or reshape slots per day. Closing for a one-off Tuesday lunch? Just delete that slot. Want to extend Friday dinner to midnight? Edit the end time.

### Special Closures
Two types are supported:

| Type | Use it for |
|---|---|
| **One-time** | Christmas Day, a private function, a public holiday |
| **Recurring** | Every Monday off, every 1st of the month, every 1 January |

Recurring closures support **weekly**, **monthly** and **yearly** patterns. The availability API filters both kinds automatically, so guests never see a date they can't actually book.

---

## Menu Management

`/admin/menu` lets staff publish the restaurant menu to the public site (`/menu`).

- **Categories** — group items (Starters, Mains, Desserts, etc.)
- **Items** — name, description, price, optional dietary tags
- **Reorder** — drag categories and items to change presentation order
- **Add / Edit / Delete** — full CRUD with instant updates

Changes are live the moment they're saved — no deploy required.

---

## Analytics

`/admin/analytics` answers the questions managers actually ask:

- How many covers did we do in the last 7 / 30 / 90 days?
- What's our cancellation and no-show rate?
- Which days of the week are quietest?
- Are guests choosing Indoor, Outdoor or showing no preference?
- Which meal period drives the most volume?

Use the **period switcher** (7 / 30 / 90 days) to compare windows.

---

## Admin User Management

`/admin/users` is where the owner manages who can log in.

- **Create** — send a new admin an email/password login.
- **Delete** — revoke access for a staff member who has left.
- All admins have full access to the dashboard — there are no role tiers (by design, to keep operations simple).

> Adding admins requires the server-side service role key to be configured — your hosting environment should already have this set.

---

## Notifications & Reminders

| Event | Who gets emailed | What's in it |
|---|---|---|
| Guest creates a booking | Guest | Confirmation + calendar links + cancel link |
| Guest creates a booking | Admin alert address | Quick summary so the team sees it instantly |
| 24 hours before the booking | Guest | Reminder with date, time and cancel link |
| Guest cancels | Admin alert address | Notice that a table has freed up |

The 24-hour reminder is driven by a daily cron job hitting `/api/cron/reminders`. On Vercel this is configured via Vercel Cron Jobs.

---

## Tips & Best Practices

**For the floor manager**
- Print the run sheet from `/admin/bookings/print` at the start of each service.
- Move bookings to **Seated** as guests arrive so the dashboard reflects reality.
- Mark no-shows promptly — they feed the analytics page and help spot patterns.

**For the owner / manager**
- Review analytics every Monday for the previous week.
- Configure recurring closures once (e.g. weekly Monday closure) rather than blocking each Monday manually.
- Keep the menu fresh — it doubles as marketing on the public site.

**For new admins**
- Bookmark `/admin` — it's the fastest way back to today's view.
- Use the eye-icon quick view on the bookings list before opening a full detail page; it's much faster when scanning the floor.
- When editing a booking, double-check the section preference — Outdoor seats are the most-requested and the first to fill.

---

## Frequently Asked Questions

**Can a guest book the same day?**
Yes, as long as the chosen meal period hasn't started yet and seats are available.

**What happens if a meal period fills up?**
The time slot disappears from the wizard. Guests cannot overbook capacity.

**Can we close at short notice?**
Yes — add a **one-time closure** in `/admin/settings` for the affected date. Any bookings for that day stay in the system; cancel them from `/admin/bookings` and the guests will be notified by email.

**Can two staff members work in the dashboard at the same time?**
Yes. Each admin logs in with their own credentials and the dashboard reads live data, so changes show up for everyone.

**What if a guest loses their confirmation email?**
Look them up in `/admin/bookings` by name or email. From the detail page you can re-send the confirmation or cancel on their behalf.

**Does the system work offline?**
No — it's a live web app and needs internet access on both the guest's device and the admin's device. The trade-off is that everyone is always looking at the same up-to-date data.

**Can guests pay a deposit at booking time?**
Not in this version — payments are handled in person at the restaurant. The architecture leaves room to add a payment step later if needed.

---

*For setup, environment variables and deployment notes, see [`README.md`](./README.md). For the engineering test plan, see [`TEST_PLAN.md`](./TEST_PLAN.md).*
