import { SidebarInset } from '@/components/ui/sidebar';
import useTranslation from '@/hooks/use-translation';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    const { currentLocale } = useTranslation();
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main
            className={`mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl`}
            {...props}
        >
            {children}
        </main>
    );
}
