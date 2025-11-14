import { Toaster } from '@/components/ui/sonner';
import useTranslation from '@/hooks/use-translation';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const AppLayout = ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { currentLocale } = useTranslation();
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <div className={`p-2`}>{children}</div>
            <Toaster />
        </AppLayoutTemplate>
    );
};

export default AppLayout;
