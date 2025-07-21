import { join } from "path";

export const getDailyObjectPath = (wp: {
  year: string;
  month: string;
  day: string;
  filename: string | null;
}): string => {
  return join(wp.year, wp.month, wp.day, wp.filename || 'image.jpg');
};
