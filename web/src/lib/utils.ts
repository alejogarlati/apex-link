import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases condicionales con clsx y resuelve conflictos de Tailwind con twMerge.
 * Estándar obligatorio según las reglas de Frontend.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
