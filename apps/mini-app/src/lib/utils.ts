import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate a string to a maximum length, keeping the beginning and end of the string
 * @param {string} str The string to truncate
 * @param {number} maxLength The maximum length of the string
 * @returns {string} The truncated string
 */
export const truncateMiddle = (str: string, maxLength = 9) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength / 2) + "..." + str.slice(-maxLength / 2);
  }
  return str;
};
