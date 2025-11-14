import { Badge } from '@/components/ui/badge';
import { Stepper, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';

// pick icons from lucide-react
import MyNoData from '@/components/my-no-data';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';
import { TransactionDetailDialog } from '@/pages/nokor-tech/components/TransactionDetailDialog';
import OrderItemCard from '@/pages/user-dashboard/orders/components/OrderItemCard';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, Clock, CreditCard, Loader2, ShoppingCart, Truck } from 'lucide-react';
import { ShopHoverCard } from './components/ShopHoverCard';
import { UserHoverCard } from './components/UserHoverCard';
import PaymentMethodLabel from '@/components/PaymentMethodLabel';

const Show = () => {
    const { order_detail } = usePage().props;
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Shop Orders'), href: '/shop-orders' },
        { title: order_detail?.order_number.split('-').slice(1).join('-'), href: '#' },
    ];

    // attach icons to each step
    const steps = [
        {
            title: 'Order Created',
            icon: ShoppingCart,
        },
        {
            title: 'Payment',
            icon: CreditCard,
        },
        {
            title: 'Shipped',
            sub_title: '(Shipped out)',
            icon: Truck,
        },
        {
            title: 'Completed',
            sub_title: '(Buyer received)',
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
                label: 'Completed',
                color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                icon: CheckCircle2,
            };
        }
        if (stepIndex + 1 === currentStep) {
            return {
                label: 'In Progress',
                color: 'bg-yellow-500 text-white dark:bg-yellow-600',
                icon: Loader2,
            };
        }
        return {
            label: 'Pending',
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
            icon: Clock,
        };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Stepper value={currentStep} className="space-y-8 p-4 lg:p-6">
                <StepperNav className="border-primary mb-15 grid grid-cols-1 items-start gap-4 gap-y-8 border-l-2 max-lg:pl-6 lg:grid-cols-4 lg:border-none">
                    {steps.map((step, index) => {
                        const badge = getBadge(index);
                        const Icon = step.icon;
                        return (
                            <StepperItem key={index} step={index + 1} className="relative w-full">
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
                <p className="text-muted-foreground mb-4 text-lg font-bold">Order Detail</p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2 rounded-2xl border p-4">
                        <div className="flex items-center gap-2">
                            Order Number : <span className="font-bold">{order_detail?.order_number.split('-').slice(1).join('-')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            Order Date :{' '}
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
                            Order Status :
                            <span className="capitalize">
                                <StatusBadge status={order_detail?.status} />
                            </span>
                        </div>
                        {order_detail?.shop && (
                            <div className="flex items-center gap-2">
                                Shop : <ShopHoverCard shop={order_detail?.shop} />
                            </div>
                        )}
                        {order_detail?.buyer && (
                            <div className="flex items-center gap-2">
                                Buyer : <UserHoverCard user={order_detail?.buyer} />
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            Buyer Note : <span className="text-base">{order_detail?.notes || '---'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            Shipping Address : <span className="text-base">{order_detail?.shipping_address || '---'}</span>
                        </div>
                    </div>
                    <div className="space-y-2 rounded-2xl border p-4">
                        <div className="flex">
                            <span className="rounded-md border">
                                <TransactionDetailDialog tranId={order_detail?.tran_id} detail={order_detail?.transaction_detail || '---'} />
                            </span>
                        </div>
                        <div className="flex items-center gap-2">Transaction ID : {order_detail?.tran_id}</div>
                        <div className="flex items-center gap-2">Pyament Method : <PaymentMethodLabel value={order_detail?.payment_method} /></div>
                        <div className="flex items-center gap-2">
                            Pyament Status : <StatusBadge status={order_detail?.payment_status} />
                        </div>
                        <div className="flex items-center gap-2">
                            Shipping Price : <span className="text-xl">$ {order_detail?.shipping_price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            Total Amount : <span className="text-xl font-bold">$ {order_detail?.total_amount}</span>
                        </div>
                    </div>
                </div>

                <StepperPanel className="text-sm">
                    <p className="text-muted-foreground mb-4 text-lg font-bold">Order Items</p>
                    {order_detail?.order_items?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-2">
                            {order_detail?.order_items?.map((order_item) => <OrderItemCard key={order_item.id} order_item={order_item} />)}
                        </div>
                    ) : (
                        <MyNoData />
                    )}

                    {/* {steps.map((step, index) => (
                        <StepperContent key={index} value={index + 1} className="flex items-center justify-center">
                            Step {step.title} content
                        </StepperContent>
                    ))} */}
                </StepperPanel>

                {/* <div className="flex items-center justify-between gap-2.5">
                    <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)} disabled={currentStep === 1}>
                        Previous
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep((prev) => prev + 1)} disabled={currentStep === steps.length + 1}>
                        Next
                    </Button>
                </div> */}
            </Stepper>
        </AppLayout>
    );
};

export default Show;
