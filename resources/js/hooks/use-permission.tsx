import { usePage } from '@inertiajs/react';

export default function usePermission() {
  const { auth } = usePage().props;
  const permissions = auth?.permissions || [];

  // Return a function that checks for a specific permission
  return (permission: string): boolean => permissions.includes(permission);
}
