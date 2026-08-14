import { clsx, type ClassValue } from 'clsx'

/** Merge class names, skipping falsy values. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
