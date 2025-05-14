
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add a utility function for quote transitions
export const fadeTransition = (isVisible: boolean): string => {
  return isVisible 
    ? "opacity-100 translate-y-0" 
    : "opacity-0 translate-y-4";
};
