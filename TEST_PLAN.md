# Tres Jolie Booking System - Test Plan

## Prerequisites

Before testing, ensure:
- [ ] App is running locally (`npm run dev`)
- [ ] Database is migrated and seeded
- [ ] Admin user is created in Supabase Auth
- [ ] Resend API key is configured (for email tests)
- [ ] Have access to the admin email inbox

---

## 1. Landing Page

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1.1 | Page loads | Navigate to `/` | Hero section, restaurant info, hours, and "Book a Table" button display |
| 1.2 | Book a Table CTA | Click "Book a Table" button | Navigates to `/book` |
| 1.3 | Navigation links | Click nav links (if present) | Navigate to correct sections/pages |
| 1.4 | Mobile layout | Resize to 375px width | Layout is responsive, no horizontal scroll |
| 1.5 | SEO metadata | View page source | Title, description, and Open Graph tags present |

---

## 2. Booking Wizard - Step 1: Date & Party Size

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 2.1 | Date picker loads | Navigate to `/book` | Calendar displays with current month |
| 2.2 | Mondays disabled | View calendar | All Mondays are greyed out / unselectable |
| 2.3 | Past dates disabled | View calendar | Dates before today are greyed out |
| 2.4 | Select valid date | Click a valid Tuesday-Sunday date | Date is highlighted, step advances or enables "Next" |
| 2.5 | Party size selector | Adjust party size (1-20) | Counter updates, value persists |
| 2.6 | Large party message | Set party size > 20 | "Call us" message appears |
| 2.7 | Special closures | Add a closure via admin, then check calendar | Closure date is disabled |

---

## 3. Booking Wizard - Step 2: Time Slot Selection

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 3.1 | Slots load | Select a date + party size, go to step 2 | Time slots grouped by meal period display |
| 3.2 | Meal period grouping | Select a Friday | Breakfast, Lunch, AND Dinner slots appear |
| 3.3 | Weekday no dinner | Select a Tuesday | Only Breakfast and Lunch slots appear (no Dinner) |
| 3.4 | Slot selection | Click a time slot | Slot is highlighted as selected |
| 3.5 | Fully booked slot | Book enough covers to fill a slot, check again | Slot shows as unavailable / greyed out |
| 3.6 | Remaining capacity | View available slots | Remaining covers displayed per slot |

---

## 4. Booking Wizard - Step 3: Guest Details

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 4.1 | Form renders | Reach step 3 | Name, email, phone, section, children, requests fields display |
| 4.2 | Required fields | Submit with empty name | Validation error on name field |
| 4.3 | Email validation | Enter invalid email (e.g. "abc") | Validation error on email field |
| 4.4 | SA phone format | Enter `0821234567` | Accepted (valid SA format) |
| 4.5 | SA phone +27 | Enter `+27821234567` | Accepted (valid SA format) |
| 4.6 | Invalid phone | Enter `12345` | Validation error on phone field |
| 4.7 | Section preference | Select "Indoor" / "Outdoor" / "No preference" | Selection saved correctly |
| 4.8 | Special requests | Enter text in requests field | Text saved, visible in review step |
| 4.9 | Children count | Set children count to 3 | Value saved and shown in review |

---

## 5. Booking Wizard - Step 4: Review & Confirm

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 5.1 | Review displays | Reach step 4 | All selected details shown (date, time, name, etc.) |
| 5.2 | Edit from review | Click back / edit buttons | Returns to previous step with values preserved |
| 5.3 | Submit booking | Click "Confirm Booking" | Loading state shown, then redirect to confirmation |
| 5.4 | Toast notification | Submit successfully | Sonner toast: "Booking confirmed! Check your email for details." |
| 5.5 | Confirmation redirect | After submit | Redirected to `/book/confirmation/[ref]` |

---

## 6. Confirmation Page

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 6.1 | Details display | View confirmation page | Reference code, date, time, party size, guest name shown |
| 6.2 | Reference format | Check reference code | Format is "TJ-XXXX" (4 alphanumeric chars) |
| 6.3 | Google Calendar | Click "Add to Google Calendar" | Opens Google Calendar with pre-filled event details |
| 6.4 | Download .ics | Click "Download .ics" / Apple/Outlook button | .ics file downloads with correct event details |
| 6.5 | Invalid reference | Navigate to `/book/confirmation/INVALID` | Error message or "booking not found" |

---

## 7. Email Notifications

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 7.1 | Confirmation email | Complete a booking | Guest receives confirmation email with reference, details, cancellation link |
| 7.2 | Admin alert email | Complete a booking | Admin email receives new booking alert |
| 7.3 | Cancellation email | Cancel a booking | Guest receives cancellation confirmation email |
| 7.4 | Email content | Open confirmation email | Contains restaurant address, Google Maps link, contact info |
| 7.5 | Cancellation link | Click cancel link in email | Opens `/book/cancel/[token]` page |

---

## 8. Cancellation Flow

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 8.1 | Cancel page loads | Navigate to `/book/cancel/[valid-token]` | Booking details and "Confirm Cancellation" button shown |
| 8.2 | Confirm cancellation | Click "Confirm Cancellation" | Booking status changes to CANCELLED |
| 8.3 | Toast notification | Cancel successfully | Toast: "Booking cancelled. Confirmation email sent." |
| 8.4 | Cancelled email | After cancellation | Cancellation confirmation email sent to guest |
| 8.5 | Capacity freed | Cancel, then check availability | Cancelled covers are now available again |
| 8.6 | Invalid token | Navigate to `/book/cancel/INVALID` | Error message or "booking not found" |
| 8.7 | Already cancelled | Try to cancel same booking twice | Message indicating already cancelled |

---

## 9. Admin Authentication

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 9.1 | Login page | Navigate to `/admin/login` | Email and password form displayed |
| 9.2 | Valid login | Enter correct credentials | Redirected to `/admin` dashboard |
| 9.3 | Invalid login | Enter wrong password | Error message, stays on login page |
| 9.4 | Route protection | Navigate to `/admin` without auth | Redirected to `/admin/login` |
| 9.5 | All admin routes | Try `/admin/bookings`, `/admin/settings` etc. without auth | All redirect to login |
| 9.6 | Logout | Click logout button | Redirected to login, session cleared |

---

## 10. Admin Dashboard

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 10.1 | Dashboard loads | Login and view `/admin` | Today's stats, upcoming bookings display |
| 10.2 | Today's count | Create bookings for today | Booking count and total covers update |
| 10.3 | Upcoming bookings | Create future bookings | Next 7 days summary shown |
| 10.4 | Quick actions | Click "Mark as completed" on a booking | Status updates, toast confirms |

---

## 11. Admin Bookings List

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 11.1 | List loads | Navigate to `/admin/bookings` | Table of bookings displays |
| 11.2 | Search by name | Enter guest name in search | Results filtered to matching bookings |
| 11.3 | Search by reference | Enter "TJ-XXXX" in search | Matching booking found |
| 11.4 | Search by email | Enter guest email | Matching bookings shown |
| 11.5 | Filter by status | Select "Confirmed" filter | Only confirmed bookings shown |
| 11.6 | Filter by date | Select a date range | Only bookings in range shown |
| 11.7 | Empty results | Search for non-existent name | "No bookings found" message |

---

## 12. Admin Booking Detail

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 12.1 | Detail loads | Click a booking in the list | Full booking details displayed |
| 12.2 | Mark completed | Click "Mark as Completed" | Status changes to COMPLETED, toast confirms |
| 12.3 | Mark no-show | Click "Mark as No-Show" | Status changes to NO_SHOW |
| 12.4 | Cancel booking | Click "Cancel" from admin | Status changes to CANCELLED, cancellation email sent |
| 12.5 | Admin notes | Add notes to a booking | Notes saved and visible on reload |

---

## 13. Admin Manual Booking

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 13.1 | Form loads | Navigate to `/admin/bookings/new` | Booking creation form displays |
| 13.2 | Create booking | Fill form and submit | Booking created, toast: "Booking created for [name]" |
| 13.3 | Validation | Submit with missing required fields | Validation errors shown |
| 13.4 | Confirmation email | Create a booking | Guest receives confirmation email |

---

## 14. Admin Calendar View

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 14.1 | Month view | Navigate to `/admin/calendar` | Current month grid with booking counts per day |
| 14.2 | Day detail | Click a day with bookings | Day's bookings listed below the calendar |
| 14.3 | Navigate months | Click next/previous month arrows | Calendar updates to show correct month |
| 14.4 | Empty day | Click a day with no bookings | "No bookings" message |

---

## 15. Admin Settings

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 15.1 | Settings load | Navigate to `/admin/settings` | Operating hours and closures sections display |
| 15.2 | Edit hours | Change breakfast open time for Tuesday | Saved, toast: "Operating hours updated" |
| 15.3 | Edit capacity | Change max covers for lunch | Saved, reflected in availability API |
| 15.4 | Add closure | Add a special closure date with reason | Closure saved, date blocked in booking calendar |
| 15.5 | Remove closure | Delete a special closure | Closure removed, date available again |
| 15.6 | Disable meal period | Toggle a meal period to inactive | Slots for that period no longer shown to guests |

---

## 16. API Endpoint Tests

Test these directly via curl or a tool like Postman/Insomnia.

### Availability API

```bash
# Check availability for a specific date
curl "http://localhost:3000/api/bookings/availability?date=2026-04-10&partySize=4"
```

| # | Test Case | Expected |
|---|-----------|----------|
| 16.1 | Valid date | Returns available time slots with remaining capacity |
| 16.2 | Monday | Returns empty or error (restaurant closed) |
| 16.3 | Past date | Returns error or empty slots |
| 16.4 | Special closure date | Returns empty or closed message |

### Booking Creation API

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-04-10","time":"12:30","partySize":4,"guestName":"Test User","guestEmail":"test@example.com","guestPhone":"0821234567","sectionPreference":"NO_PREFERENCE"}'
```

| # | Test Case | Expected |
|---|-----------|----------|
| 16.5 | Valid booking | 201 with booking reference |
| 16.6 | Missing fields | 400 with validation errors |
| 16.7 | Invalid phone | 400 with phone validation error |
| 16.8 | Past date | 400 error |

### Cancellation API

```bash
curl -X POST http://localhost:3000/api/bookings/cancel/[cancel-token]
```

| # | Test Case | Expected |
|---|-----------|----------|
| 16.9 | Valid token | 200, booking cancelled |
| 16.10 | Invalid token | 404, not found |
| 16.11 | Already cancelled | 400, already cancelled |

### Reminders Cron

```bash
curl -X POST http://localhost:3000/api/cron/reminders
```

| # | Test Case | Expected |
|---|-----------|----------|
| 16.12 | Has upcoming bookings | Sends reminder emails for bookings 24h from now |
| 16.13 | No upcoming bookings | Returns success with 0 reminders sent |

---

## 17. Responsive / Mobile Testing

Test at these viewport widths: 375px (phone), 768px (tablet), 1024px (small laptop), 1440px (desktop).

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 17.1 | Landing page mobile | View at 375px | No overflow, text readable, CTA accessible |
| 17.2 | Booking wizard mobile | Complete flow at 375px | All steps usable, calendar tappable, form fields full-width |
| 17.3 | Admin sidebar mobile | View admin at 375px | Sidebar collapses to hamburger menu or sheet |
| 17.4 | Admin tables mobile | View bookings list at 375px | Table scrollable or cards layout |
| 17.5 | Calendar mobile | View admin calendar at 375px | Month grid fits screen |

---

## 18. Edge Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 18.1 | Capacity limit | Book until a slot is full, try one more | "No availability" or slot greyed out |
| 18.2 | Concurrent bookings | Two users book the last slot simultaneously | One succeeds, other gets capacity error |
| 18.3 | Party size = 1 | Book for 1 person | Works normally |
| 18.4 | Party size = 20 | Book for 20 people | Works if capacity allows |
| 18.5 | Special characters | Enter name with accents (e.g. "Rene") | Stored and displayed correctly |
| 18.6 | Long special requests | Enter 500+ characters in requests | Saved without truncation |
| 18.7 | Booking on closure boundary | Add closure for tomorrow, try to book | Correctly blocked |
| 18.8 | Timezone handling | Book from different timezone | Date/time stored as restaurant local time |
| 18.9 | Back button during wizard | Use browser back mid-flow | Previous step shown with data preserved |
| 18.10 | Refresh during wizard | Refresh browser mid-flow | Form state handled gracefully |

---

## Test Completion Checklist

- [ ] All landing page tests pass (1.1 - 1.5)
- [ ] All booking wizard tests pass (2.1 - 5.5)
- [ ] Confirmation page works (6.1 - 6.5)
- [ ] All emails send correctly (7.1 - 7.5)
- [ ] Cancellation flow works end-to-end (8.1 - 8.7)
- [ ] Admin auth works (9.1 - 9.6)
- [ ] Admin dashboard accurate (10.1 - 10.4)
- [ ] Admin bookings list + filters work (11.1 - 11.7)
- [ ] Admin booking detail + status changes work (12.1 - 12.5)
- [ ] Manual booking creation works (13.1 - 13.4)
- [ ] Admin calendar view works (14.1 - 14.4)
- [ ] Admin settings CRUD works (15.1 - 15.6)
- [ ] All API endpoints return correct responses (16.1 - 16.13)
- [ ] Mobile responsive on all pages (17.1 - 17.5)
- [ ] Edge cases handled (18.1 - 18.10)
