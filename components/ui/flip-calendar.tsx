"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { FiArrowLeft, FiArrowRight, FiEdit } from "react-icons/fi";
import { useDayzed } from "dayzed";

type FlipCalendarProps = {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
};

export function FlipCalendar({ selected, onSelect, disabled }: FlipCalendarProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const date = selected ?? new Date();

  const handleSelectDate = (selectedDate: { date: Date; selectable: boolean }) => {
    if (!selectedDate.selectable) return;
    if (disabled?.(selectedDate.date)) return;
    onSelect(selectedDate.date);
    setIndex((pv) => pv + 1);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="relative flex flex-col items-center text-foreground md:flex-row md:items-start md:gap-4">
      <CalendarDisplay
        index={index}
        date={date}
        visible={visible}
        setVisible={setVisible}
      />
      <AnimatePresence>
        {visible && (
          <DatePicker
            selected={date}
            onDateSelected={handleSelectDate}
            minDate={today}
            disabled={disabled}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CalendarDisplay({
  index,
  date,
  visible,
  setVisible,
}: {
  index: number;
  date: Date;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-52 overflow-hidden rounded-xl border-2 border-[#B6BE9C] bg-[#B6BE9C]">
      <div className="flex items-center justify-between px-3 py-1">
        <span className="text-sm font-medium uppercase text-foreground">
          {format(date, "LLLL")}
        </span>
        <button
          type="button"
          onClick={() => setVisible((pv) => !pv)}
          className="text-foreground transition-colors hover:text-foreground/60"
          aria-label={visible ? "Hide calendar" : "Show calendar"}
        >
          {visible ? <FiArrowLeft /> : <FiEdit />}
        </button>
      </div>
      <div
        className="relative h-36 w-full shrink-0"
        style={{ perspective: "400px" }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
              zIndex: -index,
              backfaceVisibility: "hidden",
            }}
            key={index}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
            }}
            initial={{ rotateX: "0deg" }}
            animate={{ rotateX: "0deg" }}
            exit={{ rotateX: "-180deg" }}
            className="absolute inset-0"
          >
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-white text-6xl font-light">
              {format(date, "do")}
            </div>
          </motion.div>
          <motion.div
            style={{
              clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
              zIndex: index,
              backfaceVisibility: "hidden",
            }}
            key={(index + 1) * 2}
            initial={{ rotateX: "180deg" }}
            animate={{ rotateX: "0deg" }}
            exit={{ rotateX: "0deg" }}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-white text-6xl font-light">
              {format(date, "do")}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                {format(date, "yyyy")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DatePicker({
  disabled,
  ...props
}: {
  selected: Date;
  onDateSelected: (dateObj: { date: Date; selectable: boolean }) => void;
  minDate: Date;
  disabled?: (date: Date) => boolean;
}) {
  const { calendars, getBackProps, getForwardProps, getDateProps } =
    useDayzed(props);

  const calendar = calendars[0];

  if (!calendar) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-4 w-52 rounded-lg border border-[#B6BE9C] bg-white p-3 md:mt-0"
    >
      <div className="mb-2 flex items-center justify-between">
        <button type="button" className="p-1" aria-label="Previous month" {...getBackProps({ calendars })}>
          <FiArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {MONTH_NAMES[calendar.month]} {calendar.year}
        </span>
        <button type="button" className="p-1" aria-label="Next month" {...getForwardProps({ calendars })}>
          <FiArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div key={`${calendar.month}${calendar.year}`}>
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAY_NAMES.map((weekday) => (
            <div
              key={`${calendar.month}${calendar.year}${weekday}`}
              className="text-center text-xs text-muted-foreground"
            >
              {weekday}
            </div>
          ))}
        </div>
        {calendar.weeks.map((week, weekIndex) => (
          <div key={`week-${calendar.month}${calendar.year}${weekIndex}`} className="grid grid-cols-7">
            {week.map((dateObj, idx) => {
              const key = `${calendar.month}${calendar.year}${weekIndex}${idx}`;
              if (!dateObj) {
                return <div key={key} />;
              }
              const { date, selected, selectable } = dateObj;
              const isDisabled = !selectable || (disabled?.(date) ?? false);
              return (
                <button
                  type="button"
                  className={`aspect-square rounded text-sm transition-colors ${
                    selected
                      ? "bg-[#B6BE9C] font-medium"
                      : isDisabled
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "hover:bg-[#B6BE9C]/20"
                  }`}
                  key={key}
                  {...getDateProps({ dateObj })}
                  disabled={isDisabled}
                  aria-label={format(date, "EEEE, MMMM d, yyyy")}
                  aria-disabled={isDisabled}
                  onClick={
                    isDisabled
                      ? (e) => e.preventDefault()
                      : getDateProps({ dateObj }).onClick
                  }
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
