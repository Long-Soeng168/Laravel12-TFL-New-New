import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useTranslation from '@/hooks/use-translation';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardListIcon, ScanEyeIcon } from 'lucide-react';
import PaymentMethodLabel from './PaymentMethodLabel';

export function UserOrdersFloatButton() {
    const { user_orders } = usePage().props;
    const { t } = useTranslation();
    // console.log(user_orders);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className={`fixed right-6 bottom-22 z-50 sm:bottom-6 ${(user_orders?.length ?? 0) === 0 ? 'hidden' : ''}`}>
                    <div className="rainbow-button rounded-full transition-all duration-300">
                        <div className="bg-background/50 rounded-full p-1 transition-all duration-300">
                            <span className="group border-foreground bg-background text-foreground relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border-[1.5px] text-base font-semibold transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-white hover:text-white active:scale-[0.95]">
                                {/* Circle expansion effect */}
                                <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111111] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100"></span>

                                {/* Icon + Text */}
                                <div className="relative z-[9] flex flex-col items-center justify-center">
                                    <ClipboardListIcon className="stroke-foreground h-6 w-6 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:stroke-white" />
                                    <span className="text-xs transition-colors duration-300 group-hover:text-white">Orders</span>
                                </div>
                            </span>
                        </div>
                    </div>
                </button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Recent Orders</SheetTitle>
                    <SheetDescription>Orders that are not completed yet.</SheetDescription>
                </SheetHeader>
                <div className="h-full overflow-y-scroll px-4">
                    {user_orders?.map((item: any, index: number) => (
                        <Link href={`/user-orders/${item.id}`}>
                            <div
                                key={item.id}
                                className="bg-background mb-4 flex flex-col gap-3 rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md"
                            >
                                {/* Top row: Order info + actions */}
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-semibold">Order {item.order_number.split('-').slice(1).join('-')}</h3>
                                        <p className="text-muted-foreground text-xs">
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleString('en-UK', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: '2-digit',
                                                      hour: 'numeric',
                                                      minute: 'numeric',
                                                      hour12: true,
                                                  })
                                                : '---'}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button title={t('View Order')} variant="outline" className="text-primary">
                                            <ScanEyeIcon className="h-4 w-4" /> View
                                        </Button>
                                    </div>
                                </div>

                                {/* Status badges */}
                                <div className="flex flex-wrap items-center gap-2 capitalize">
                                    <StatusBadge status={item.status} />
                                </div>

                                {/* Order details */}
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Amount</span>
                                        <span className="font-medium">
                                            {item.currency === 'KHR' ? '៛ ' : '$ '}
                                            {item.total_amount}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Payment</span>
                                        <PaymentMethodLabel value={item.payment_method} />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Payment Status</span>
                                        <span className="">{item.payment_status}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <SheetFooter>
                    <Link href={`/user-orders`} className="w-full">
                        <Button type="button" className="w-full">
                            <ClipboardListIcon />
                            All Your Orders
                        </Button>
                    </Link>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
