import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { HouseIcon, StoreIcon } from 'lucide-react';
import { MyTooltipButton } from './my-tooltip-button';
import SwitchLanguageAdmin from './switch-language-admin';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { can_switch_language, auth } = usePage().props;

    return (
        <header className="border-sidebar-border/50 sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 rounded-tl-lg rounded-tr-lg border-b bg-white/5 px-6 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1 flex-wrap">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                {/* <span className='mr-1'>
                    <ToggleModeSwitch />
                </span> */}
                {auth?.shop?.id && (
                    <MyTooltipButton title="View Shop Profile" size="icon" variant="ghost" className="hover:bg-foreground/5">
                        <Link href={'/shops/' + auth?.shop?.id} prefetch>
                            <StoreIcon />
                        </Link>
                    </MyTooltipButton>
                )}
                <MyTooltipButton title="Home Page" size="icon" variant="ghost" className="hover:bg-foreground/5 mr-4">
                    <Link href={'/'} prefetch>
                        <HouseIcon />
                    </Link>
                </MyTooltipButton>
                {can_switch_language == true && <SwitchLanguageAdmin />}
            </div>
        </header>
    );
}
