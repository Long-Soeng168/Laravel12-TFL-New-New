import { Badge } from '@/components/ui/badge';
import { Stepper, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';

// pick icons from lucide-react
import MyNoData from '@/components/my-no-data';
import PaymentMethodLabel from '@/components/PaymentMethodLabel';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';
import { TransactionDetailDialog } from '@/pages/nokor-tech/components/TransactionDetailDialog';
import OrderItemCard from '@/pages/user-dashboard/orders/components/OrderItemCard';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, Clock, CreditCard, Loader2, ShoppingCart, Truck } from 'lucide-react';
import { ShopHoverCard } from './components/ShopHoverCard';
import UpdateOrderStatus from './components/UpdateOrderStatus';
import { UserHoverCard } from './components/UserHoverCard';

const Show = () => {
    const { order_detail } = usePage().props;
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('All Orders'), href: '/admin/orders' },
        { title: order_detail?.order_number.split('-').slice(1).join('-'), href: '#' },
    ];

    // attach icons to each step
    const steps = [
        {
            title: t('Order Created'),
            icon: ShoppingCart,
        },
        {
            title: t('Payment'),
            icon: CreditCard,
        },
        {
            title: t('Shipped'),
            sub_title: t('(Shipped out)'),
            icon: Truck,
        },
        {
            title: t('Completed'),
            sub_title: t('(Buyer received)'),
            icon: CheckCircle2,
        },
    ];

    const [currentStep, setCurrentStep] = useState(2);

    useEffect(() => {
        if (order_detail?.status == 'paid') {
            setCurrentStep(3);
        }
        if (order_detail?.status == 'shipped') {
            setCurrentStep(4);
        }
        if (order_detail?.status == 'completed') {
            setCurrentStep(5);
        }

        if (order_detail?.status == 'refunded') {
            setCurrentStep(0);
        }
        if (order_detail?.status == 'cancelled') {
            setCurrentStep(0);
        }
    }, [order_detail?.status]);

    const getBadge = (stepIndex: number) => {
        if (stepIndex + 1 < currentStep) {
            return {
                label: t('Completed'),
                color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                icon: CheckCircle2,
            };
        }
        if (stepIndex + 1 === currentStep) {
            return {
                label: t('In Progress'),
                color: 'bg-yellow-500 text-white dark:bg-yellow-600',
                icon: Loader2,
            };
        }
        return {
            label: t('Pending'),
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
            icon: Clock,
        };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Stepper value={currentStep} className="space-y-8 p-4 lg:p-6">
                <StepperNav
                    key={`${order_detail?.status}`}
                    className="border-primary mb-15 grid grid-cols-1 items-start gap-4 gap-y-8 border-l-2 max-lg:pl-6 lg:grid-cols-4 lg:border-none"
                >
                    {steps.map((step, index) => {
                        const badge = getBadge(index);
                        const Icon = step.icon;
                        return (
                            <StepperItem key={step.title} step={index + 1} className="relative w-full">
                                <StepperTrigger className="flex grow flex-col items-start gap-3.5">
                                    <StepperIndicator
                                        className={`h-1 rounded-full lg:w-full ${index + 1 <= currentStep ? '!bg-primary' : '!bg-border'}`}
                                    />
                                    <div className="flex flex-col items-start gap-1">
                                        <div className="text-muted-foreground text-[10px] font-semibold">Step {index + 1}</div>
                                        <StepperTitle className="flex items-center gap-2 text-start font-semibold">
                                            <Icon size={16} className="text-muted-foreground" />
                                            {step.title}
                                            <span className="text-muted-foreground text-sm font-normal">{step.sub_title}</span>
                                        </StepperTitle>
                                        <Badge className={`${badge.color} mt-1 flex items-center gap-1`}>
                                            <badge.icon size={12} className="shrink-0" />
                                            {badge.label}
                                        </Badge>
                                    </div>
                                </StepperTrigger>
                            </StepperItem>
                        );
                    })}
                </StepperNav>
                <p className="text-muted-foreground mb-4 text-lg font-bold">{t('Order Detail')}</p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2 rounded-2xl border p-4">
                        <div className="flex items-center gap-2">
                            {t('Order ID')} : <span className="font-bold">{order_detail?.id}</span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                            {t('Order Number')} : <span>{order_detail?.order_number.split('-').slice(1).join('-')}</span>
                        </div> */}
                        <div className="flex items-center gap-2">
                            {t('Order Date')} :{' '}
                            <span className="text-base">
                                {order_detail?.created_at
                                    ? new Date(order_detail?.created_at).toLocaleString('en-UK', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: '2-digit',
                                          hour: 'numeric',
                                          minute: 'numeric',
                                          hour12: true, // 👈 forces AM/PM
                                      })
                                    : '---'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {t('Order Status')} :
                            <span className="capitalize">
                                <UpdateOrderStatus />
                                {/* <StatusBadge status={order_detail?.status} /> */}
                            </span>
                        </div>
                        {order_detail?.shop && (
                            <div className="flex items-center gap-2">
                                {t('Shop')} : <ShopHoverCard shop={order_detail?.shop} />
                            </div>
                        )}
                        {order_detail?.buyer && (
                            <div className="flex items-center gap-2">
                                {t('Buyer')} : <UserHoverCard user={order_detail?.buyer} />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2 rounded-2xl border p-4">
                        <div className="flex">
                            <span className="rounded-md border">
                                <TransactionDetailDialog order_id={order_detail?.id} detail={order_detail?.transaction_detail || '---'} />
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {t('Pyament Gateway')} : <PaymentMethodLabel value={order_detail?.payment_method || '---'} />
                        </div>
                        <div className="flex items-center gap-2">
                            {t('Pyament Method')} : <PaymentMethodLabel value={order_detail?.payment_method_bic || '---'} />
                        </div>
                        <div className="flex items-center gap-2">
                            {t('Transaction ID')} : {order_detail?.transaction_id || '---'}
                        </div>

                        <div className="flex items-center gap-2">
                            {t('Pyament Status')} : <StatusBadge status={order_detail?.payment_status} />
                        </div>
                        <div className="flex items-center gap-2">
                            {t('Shipping Price')} : <span className="text-xl">$ {order_detail?.shipping_price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {t('Total Amount')} : <span className="text-xl font-bold">$ {order_detail?.total_amount}</span>
                        </div>
                    </div>
                </div>

                <StepperPanel className="text-sm">
                    <p className="text-muted-foreground mb-4 text-lg font-bold">{t('Order Items')}</p>
                    {order_detail?.order_items?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-2">
                            {order_detail?.order_items?.map((order_item) => <OrderItemCard key={order_item.id} order_item={order_item} />)}
                        </div>
                    ) : (
                        <MyNoData />
                    )}
                </StepperPanel>
            </Stepper>
        </AppLayout>
    );
};

export default Show;
