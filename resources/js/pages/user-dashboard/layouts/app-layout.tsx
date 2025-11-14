import { Toaster } from '@/components/ui/sonner';
import useTranslation from '@/hooks/use-translation';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import AppLayoutTemplate from './app/app-sidebar-layout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const UserDashboardAppLayout = ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { currentLocale } = useTranslation();
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <div className={`p-2`}>{children}</div>
            <Toaster />
        </AppLayoutTemplate>
    );
};

export default UserDashboardAppLayout;
