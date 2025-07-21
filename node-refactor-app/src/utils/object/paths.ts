import { join } from "path";

export const getDailyObjectPath = (wp: {
  year: string;
  month: string;
  day: string;
  filename: string | null;
  date: string;
}): string => {
  return join(wp.year, wp.month, wp.day, wp.filename || `${wp.date}.jpg`);
};
