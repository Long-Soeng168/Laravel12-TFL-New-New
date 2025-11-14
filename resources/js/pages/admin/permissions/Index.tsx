import { MyPagination } from '@/components/my-pagination';
import { MyRefreshButton } from '@/components/my-refresh-button';
import { MySearchTableData } from '@/components/my-search-table-data';
import usePermission from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import AddNewButton from './components/add-new-button';
import MyTableData from './components/my-table-data';
import useTranslation from '@/hooks/use-translation';

const Index = () => {
    const {t} = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Permissions'),
            href: '/admin/permissions',
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
                    {/* <MyExportButton />
                    <MyImportButton /> */}
                    {hasPermission('permission create') && <AddNewButton />}
                </div>
            </div>
            <div className="h-2" />
            <MyTableData />
            <MyPagination />
        </AppLayout>
    );
};

export default Index;
