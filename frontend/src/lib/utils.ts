import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDateTime = (value: Date) => {
    return `${value.toLocaleDateString()} at ${value.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })}`;
};
