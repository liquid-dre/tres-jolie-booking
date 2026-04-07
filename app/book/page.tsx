"use client";

import { useState } from "react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { StepDatePartySize } from "@/components/booking/step-date-party-size";
import { StepTimeSlot } from "@/components/booking/step-time-slot";
import { StepGuestDetails } from "@/components/booking/step-guest-details";
import { StepReview } from "@/components/booking/step-review";

export type BookingData = {
  date: string;
  partySize: number;
  time: string;
  mealPeriod: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  sectionPreference: "INDOOR" | "OUTDOOR" | "NO_PREFERENCE";
  childrenCount: number;
};

const initialData: BookingData = {
  date: "",
  partySize: 2,
  time: "",
  mealPeriod: "",
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  specialRequests: "",
  sectionPreference: "NO_PREFERENCE",
  childrenCount: 0,
};

const steps = ["Date & Guests", "Time", "Your Details", "Review"];

export default function BookPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingData>(initialData);

  function updateData(partial: Partial<BookingData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-center text-2xl font-bold sm:text-3xl">
            Book a Table
          </h1>

          {/* Progress steps */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    i <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`hidden text-sm sm:inline ${
                    i <= step
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`h-px w-6 sm:w-10 ${
                      i < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="mt-8">
            {step === 0 && (
              <StepDatePartySize
                data={data}
                updateData={updateData}
                onNext={next}
              />
            )}
            {step === 1 && (
              <StepTimeSlot
                data={data}
                updateData={updateData}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 2 && (
              <StepGuestDetails
                data={data}
                updateData={updateData}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 3 && <StepReview data={data} onBack={back} />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
