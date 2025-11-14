import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OrderSuccessDialog({
    title = 'Success!',
    sub_title = 'Payment completed.',
    description = 'Your order will be processed shortly.',
}: {
    title?: string;
    sub_title?: string;
    description?: string;
}) {
    const { url } = usePage(); // SSR-safe
    const [open, setOpen] = useState(false);
    const [orderId, setOrderId] = useState<string | null>('');

    useEffect(() => {
        if (!url) return;

        // Parse query params from Inertia URL (works SSR-safe)
        const queryParams = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost').searchParams;
        if (queryParams.get('order_success') === '1') {
            setOpen(true);
        }
        if (queryParams.get('order_id')) {
            setOrderId(queryParams.get('order_id'));
        }
    }, [url]);

    const handleClose = () => {
        setOpen(false);

        // Remove order_success from URL without reloading
        const queryParams = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost').searchParams;
        queryParams.delete('order_success');
        queryParams.delete('order_id');
        const newUrl = queryParams.toString() ? `${window.location.pathname}?${queryParams.toString()}` : window.location.pathname;

        router.visit(newUrl, { replace: true, preserveState: false, preserveScroll: true });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                handleClose();
            }}
        >
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle hidden />
                    <DialogDescription hidden />
                </DialogHeader>
                <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="stroke-green-600" size={40} />
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                        <p className="text-base font-semibold text-gray-600 dark:text-gray-400">{sub_title}</p>
                        <p className="text-base text-gray-600 dark:text-gray-400">{description}</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                        <Link href={`/`}>
                            <Button variant="outline">Home Page</Button>
                        </Link>
                        <Link href={`/user-orders/${orderId}`}>
                            <Button variant="default" className="bg-green-500 hover:bg-green-600">
                                View Order
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
