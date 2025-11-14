import MyAddNewButton from '@/components/my-add-new-button';
import { MyPagination } from '@/components/my-pagination';
import { MyRefreshButton } from '@/components/my-refresh-button';
import { MySearchTableData } from '@/components/my-search-table-data';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import ContactUsButton from '../components/contact-us-button';
import ShopSuspended from '../shops/components/shop-inactive';
import ShopPending from '../shops/components/shop-pending';
import ShopReject from '../shops/components/shop-reject';
import { MyFilterButton } from './components/my-filter-button';
import MyTableData from './components/my-table-data';

const Index = () => {
    const hasRole = useRole();
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Items'),
            href: '/user-items',
        },
    ];
    const { tableData, auth } = usePage().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {auth?.shop?.status == 'inactive' && <ShopSuspended />}
            {auth?.shop?.status == 'pending' && <ShopPending />}
            {auth?.shop?.status == 'reject' && <ShopReject />}
            <div className="flex max-w-[100vw] flex-wrap items-center justify-end gap-2">
                <div className="flex max-w-[100vw] flex-wrap items-center justify-start gap-2 max-lg:w-full lg:flex-1">
                    <MySearchTableData />
                    <MyFilterButton />
                    <MyRefreshButton />
                    <span className="flex-1"></span>
                    {/* <MyExportButton />
                    <MyImportButton /> */}
                    {auth?.shop?.status == 'active' && <>{hasRole('Shop') && <MyAddNewButton url="/user-items/create" type="link" />}</>}

                    {auth?.shop?.status == 'reject' && (
                        <>
                            <p className="font-bold text-red-400">{t('Shop Registration Rejected.')}</p>
                            <ContactUsButton />
                        </>
                    )}
                    {auth?.shop?.status == 'pending' && (
                        <>
                            <p className="font-bold text-yellow-500">{t('Shop Pending Approval.')}</p>
                            {/* <ContactUsButton /> */}
                        </>
                    )}
                    {auth?.shop?.status == 'inactive' && (
                        <>
                            <p className="font-bold text-gray-500">{t('Shop Suspended.')}</p>
                            <ContactUsButton />
                        </>
                    )}
                </div>
            </div>
            <div className="h-2" />
            <MyTableData />
            <MyPagination />
        </AppLayout>
    );
};

export default Index;
