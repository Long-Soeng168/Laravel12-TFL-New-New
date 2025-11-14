import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChartAreaInteractive } from './components/chart-area-interactive';
import SectionCards from './components/section-cards';

export default function Page() {
    const { t } = useTranslation();
    const hasPermission = usePermission();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Admin Dashboard'),
            href: '/dashboard',
        },
    ];

    const { auth } = usePage().props;
    console.log(auth.permissions);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                        {hasPermission('post view') && (
                            <div className="px-4 lg:px-6">
                                <ChartAreaInteractive />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
