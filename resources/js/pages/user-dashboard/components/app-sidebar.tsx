import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import useTranslation from '@/hooks/use-translation';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { CarIcon, FilePenLineIcon, LayoutDashboardIcon, ListTodoIcon, StoreIcon } from 'lucide-react';

export function AppSidebar() {
    const { t, currentLocale } = useTranslation();
    const mainNavItems: NavItem[] = [
        {
            title: t('Dashboard'),
            permission: '',
            url: '/dashboard',
            icon: LayoutDashboardIcon,
        },
        {
            title: t('Your Shop'),
            permission: 'Shop',
            url: '/user-shops/update',
            icon: StoreIcon,
            subItems: [
                {
                    title: t('Shop Settings'),
                    permission: 'Shop',
                    url: '/user-shops/update',
                    icon: StoreIcon,
                },
                {
                    title: t('Items'),
                    permission: 'Shop',
                    url: '/user-items',
                    icon: ListTodoIcon,
                },
            ],
        },
        {
            title: t('Your Garage'),
            permission: 'Garage',
            url: '/user-garages/update',
            icon: CarIcon,
            subItems: [
                {
                    title: t('Garage Settings'),
                    permission: 'Garage',
                    url: '/user-garages/update',
                    icon: CarIcon,
                },
                {
                    title: t('Posts'),
                    permission: 'Garage',
                    icon: FilePenLineIcon,
                    url: '/user-garage_posts',
                },
            ],
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            permission: 'sample_content view',
            title: t('Sample Content'),
            url: '/admin/ckeditor5',
            icon: FilePenLineIcon,
        },
        // {
        //     title: 'File Manager',
        //     url: '/admin/my_file_manager',
        //     icon: Folder,
        // },
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
