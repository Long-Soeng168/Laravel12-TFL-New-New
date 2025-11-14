import { usePage } from '@inertiajs/react';

export default function useRole() {
    const { auth } = usePage().props;
    const roles = auth?.roles || [];

    // Return a function that checks for a specific role
    return (role: string): boolean => roles.includes(role);
}
