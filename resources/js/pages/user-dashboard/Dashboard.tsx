import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import SectionCards from './components/SectionCards';
import RegisterSuccess from './shops/components/register-success';

const Index = () => {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('User Dashboard'),
            href: '/admin/user-dashboard',
        },
    ];
    const { flash } = usePage().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                {flash?.success && <RegisterSuccess title={flash?.success}></RegisterSuccess>}
                <SectionCards />
            </div>
        </AppLayout>
    );
};

export default Index;
