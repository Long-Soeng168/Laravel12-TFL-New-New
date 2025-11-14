import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { LogInIcon } from 'lucide-react';
import { HomeUserButtonContent } from './home-user-button-content';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function HomeUserButton() {
    const { t, currentLocale } = useTranslation();
    const getInitials = useInitials();
    const hasRole = useRole();
    const { auth } = usePage().props;

    return (
        <>
            {auth?.user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="hover:bg-secondary bg-accent hover:border-primary border-accent mr-2 flex cursor-pointer items-center justify-start gap-2 rounded-md border p-0.5 md:p-2">
                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                <AvatarImage src={`/assets/images/users/thumb/${auth?.user?.image}`} alt={auth?.user?.name} />
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(auth?.user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="max-w-32 space-y-0.5 text-start max-md:hidden">
                                <p className="text-foreground line-clamp-1 text-sm font-medium">{auth?.user?.name}</p>
                                <p className="text-muted-foreground line-clamp-1 text-xs">{auth?.user?.email}</p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="end">
                        <HomeUserButtonContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="text-muted-foreground flex items-center gap-4 px-2 text-base font-semibold">
                    <a href="/login" className="hover:text-primary flex items-center gap-1 transition-colors">
                        <LogInIcon size={18} />
                        <span className="underline-offset-4 hover:underline">{t('Login')}</span>
                    </a>
                    {/* <span className="text-border">|</span>
                    <a href="/register" className="hover:text-primary flex items-center gap-1 transition-colors">
                        <UserPlusIcon size={18} />
                        <span className="underline-offset-4 hover:underline">Register</span>
                    </a> */}
                </div>
            )}
        </>
    );
}
