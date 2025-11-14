import { MyPagination } from '@/components/my-pagination';
import { MyRefreshButton } from '@/components/my-refresh-button';
import { MySearchTableData } from '@/components/my-search-table-data';
import MyLoadingAnimationOne from '@/components/MyLoadingAnimationOne';
import { Button } from '@/components/ui/button';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router, usePoll } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import MyTableData from './components/my-table-data';

export default function Index({ tableData }: { tableData?: any }) {
    const [loading, setLoading] = useState(false);
    const minVisibleLoadingTime = 1200; // minimum duration in ms
    const loadingStartTime = useRef<number | null>(null);

    usePoll(5000, {
        onStart: () => {
            // Record the time when loading starts
            loadingStartTime.current = Date.now();
            setLoading(true);
        },
        onFinish: () => {
            if (loadingStartTime.current) {
                const elapsed = Date.now() - loadingStartTime.current;
                const remaining = minVisibleLoadingTime - elapsed;
                if (remaining > 0) {
                    // Keep loading visible for the remaining time
                    setTimeout(() => setLoading(false), remaining);
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        },
    });

    const startJob = () => {
        router.post('/queue_job/start');
    };
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Queue Jobs'),
            href: '/queue_jobs',
        },
    ];
    const hasPermission = usePermission();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex max-w-[100vw] flex-wrap items-center justify-end gap-2">
                <div className="flex max-w-[100vw] flex-wrap items-center justify-start gap-2 max-lg:w-full lg:flex-1">
                    <MySearchTableData />
                    {/* <MyFilterButton /> */}
                    <MyRefreshButton />
                    <span className="flex-1"></span>

                    <div className="flex">
                        {loading && (
                            <span>
                                <MyLoadingAnimationOne />
                            </span>
                        )}
                        <div className="border-primary rounded-xl border p-1 transition-all duration-300 hover:m-1 hover:rounded-lg hover:border-white hover:p-0">
                            <Button onClick={startJob}>
                                <Plus />
                                {t('Test New Job')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-2" />
            <MyTableData />
            <MyPagination />
        </AppLayout>
    );
}
