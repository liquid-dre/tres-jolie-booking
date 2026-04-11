export const defaultHours = [
  // Tuesday (1) - Sunday (6): Breakfast & Lunch
  ...[1, 2, 3, 4, 5, 6].flatMap((day) => [
    {
      dayOfWeek: day,
      mealPeriod: "BREAKFAST" as const,
      openTime: "09:00",
      closeTime: "11:30",
      maxCovers: 200,
    },
    {
      dayOfWeek: day,
      mealPeriod: "LUNCH" as const,
      openTime: "12:00",
      closeTime: "17:30",
      maxCovers: 300,
    },
  ]),
  // Friday (4) & Saturday (5): Dinner
  ...[4, 5].map((day) => ({
    dayOfWeek: day,
    mealPeriod: "DINNER" as const,
    openTime: "18:00",
    closeTime: "22:00",
    maxCovers: 200,
  })),
];
