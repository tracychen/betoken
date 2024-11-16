import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";

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

/**
 * Default formatter for ether amounts
 * Format wei to ether with 5 decimal places max, no trailing zeros, and rounding down to the last decimal place
 * @param {string | bigint | number} amount
 * @param {number} decimals The number of decimal places to show
 * @returns {number} The formatted ether amount
 */
export const defaultEther = (
  amount: string | bigint | number,
  decimals = 5
) => {
  try {
    const amountString = String(amount);
    let formattedAmount;
    if (amountString.includes("e")) {
      const [mantissa, exponent] = amountString.split("e");
      const fullNumber = mantissa
        .replace(".", "")
        .padEnd(parseInt(exponent) + 1, "0");
      formattedAmount = formatEther(BigInt(fullNumber));
    } else {
      formattedAmount = formatEther(BigInt(amountString));
    }

    const factor = Math.pow(10, decimals);
    const roundedDownAmount =
      Math.floor(Number(formattedAmount) * factor) / factor;
    return roundedDownAmount;
  } catch (error) {
    console.error("Error in defaultEther:", error);
    return "N/A";
  }
};

/**
 * Get the hours, minutes, and seconds from a number of milliseconds
 * @param {number} ms The number of milliseconds to convert
 * @returns {Object} An object containing the hours, minutes, and seconds
 */
export const getHoursMinutesSeconds = (ms: number) => {
  const diffInHours = ms / (1000 * 60 * 60);
  const hours = Math.floor(diffInHours);
  const minutes = Math.floor((diffInHours - hours) * 60);
  const seconds = Math.floor(((diffInHours - hours) * 60 - minutes) * 60);
  return { hours, minutes, seconds };
};

export const getCountdownStrFromTimestamp = (timestampMs: number) => {
  const now = new Date();
  const diff = timestampMs - now.getTime();
  const { hours, minutes, seconds } = getHoursMinutesSeconds(diff);
  // check if any are 0
  if (hours <= 0 && minutes <= 0 && seconds <= 0) {
    return "ENDED";
  }
  return `ENDS IN ${hours}h ${minutes}m ${seconds}s`;
};

/**
 * Convert a date to a timestamp in seconds
 * @param {Date} date The date to convert
 * @returns {number} The timestamp in seconds
 */
export const convertDateToTimestampSeconds = (date: Date): number => {
  return parseInt((date.getTime() / 1000).toString());
};

/**
 * Get the current date with time set to 00:00:00
 * @returns {Date} The current date with time set to 00:00:00
 */
export const getCurrentDate = () => {
  const today = new Date();
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );
};
