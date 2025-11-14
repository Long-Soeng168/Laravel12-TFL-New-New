import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import Create from './Create';
import useTranslation from '@/hooks/use-translation';


const Index = () => {
    const {t} = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Application Info'),
            href: '/admin/application_info',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* <div className="flex max-w-[100vw] flex-wrap items-center justify-end gap-2">
                <div className="flex max-w-[100vw] flex-wrap items-center justify-start gap-2 max-lg:w-full lg:flex-1">
                    <MySearchTableData />
                    <MyFilterButton />
                    <MyRefreshButton />
                    <span className="flex-1"></span>
                    <MyExportButton />
                    <MyImportButton />
                    <AddNewButton />
                </div>
            </div>
            <div className="h-2" />
            <MyTableData />
            <MyPagination /> */}
            <div className='p-4'>
            <Create />
            </div>

        </AppLayout>
    );
};

export default Index;
