import { z } from "zod";

export const bookingFormSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  partySize: z.number().min(1, "At least 1 guest").max(20, "For parties over 20, please call us"),
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z
    .string()
    .min(7, "Valid phone number is required")
    .regex(/^\+\d{7,15}$/, "Please enter a valid phone number"),
  specialRequests: z.string().optional(),
  sectionPreference: z.enum(["INDOOR", "OUTDOOR", "NO_PREFERENCE"]).default("NO_PREFERENCE"),
  childrenCount: z.number().min(0).default(0),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export const availabilityQuerySchema = z.object({
  date: z.string().min(1),
  partySize: z.coerce.number().min(1).max(20),
});
