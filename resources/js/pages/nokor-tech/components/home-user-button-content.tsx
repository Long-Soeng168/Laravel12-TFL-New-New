import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { ClipboardListIcon, LayoutIcon, LogOut, Settings, StoreIcon } from 'lucide-react';

interface HomeUserButtonContentProps {
    user: User;
}

export function HomeUserButtonContent({ user }: HomeUserButtonContentProps) {
    const { t } = useTranslation();
    const cleanup = useMobileNavigation();
    const hasRole = useRole();

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        {t('Settings')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={`/user-orders`} as="button" prefetch onClick={cleanup}>
                        <ClipboardListIcon className="mr-2" />
                        {t('Your Orders')}
                    </Link>
                </DropdownMenuItem>
                {hasRole('Shop') && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={`user-dashboard`} as="button" prefetch onClick={cleanup}>
                            <StoreIcon className="mr-2" />
                            {t('Store Dashboard')}
                        </Link>
                    </DropdownMenuItem>
                )}
                {hasRole('Admin') && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={`dashboard`} as="button" prefetch onClick={cleanup}>
                            <LayoutIcon className="mr-2" />
                            {t('Dashboard')}
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={cleanup}>
                    <LogOut className="mr-2" />
                    {t('Log out')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
