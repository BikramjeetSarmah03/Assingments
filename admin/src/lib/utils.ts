import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pageSizeOptions = [5, 10, 20, 50];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function arraysAreEqual(arr1: any[], arr2: any[]) {
  // Sort the arrays
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Compare the length of the arrays
  if (sortedArr1.length !== sortedArr2.length) {
    return false;
  }

  // Compare each element of the arrays
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}
