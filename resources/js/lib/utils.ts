import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatToKhmerDateTime = (utcDate?: string) => {
    if (!utcDate) return '-';
    const date = new Date(utcDate);
    return date.toLocaleString('en-GB', {
        timeZone: 'Asia/Bangkok',
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
};
