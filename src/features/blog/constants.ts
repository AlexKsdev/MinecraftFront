/**
 * How a post's date reads on cards and article pages. Shared so the list and
 * the detail page can't drift apart. next-intl localizes the month name.
 */
export const POST_DATE_FORMAT = {
  day: "numeric",
  month: "short",
  year: "numeric",
} as const;
