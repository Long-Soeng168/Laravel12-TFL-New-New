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
import UserSuspended from '../shops/components/user-suspended';
import { MyFilterButton } from './components/my-filter-button';
import MyTableData from './components/my-table-data';

const Index = () => {
    const hasRole = useRole();
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Garage Posts'),
            href: '/admin/user-garage_posts',
        },
    ];
    const { auth } = usePage().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {auth?.garage?.status == 'inactive' && (
                <UserSuspended
                    title={t('Garage Suspended!')}
                    subTitle="Your garage has been temporarily suspended. Please contact our support team to resolve this issue."
                />
            )}
            <div className="flex max-w-[100vw] flex-wrap items-center justify-end gap-2">
                <div className="flex max-w-[100vw] flex-wrap items-center justify-start gap-2 max-lg:w-full lg:flex-1">
                    <MySearchTableData />
                    <MyFilterButton />
                    <MyRefreshButton />
                    <span className="flex-1"></span>
                    {/* <MyExportButton />
                    <MyImportButton /> */}
                    {auth?.garage?.status == 'active' ? (
                        <> {hasRole('Garage') && <MyAddNewButton url="/user-garage_posts/create" type="link" />}</>
                    ) : (
                        <>
                            <p className="text-red-400">{t('Garage Suspended!')}</p>
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
