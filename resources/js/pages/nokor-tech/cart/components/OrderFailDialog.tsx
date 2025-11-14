import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link, router, usePage } from '@inertiajs/react';
import { XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OrderFailDialog({
    title = 'Failed!',
    sub_title = 'Order unsuccessful.',
    description = 'Please try again or contact support.',
}: {
    title?: string;
    sub_title?: string;
    description?: string;
}) {
    const { url } = usePage(); // SSR-safe
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!url) return;

        // Parse query params from Inertia URL (SSR-safe)
        const queryParams = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost').searchParams;

        if (queryParams.get('order_fail') === '1') {
            setOpen(true);
        }
    }, [url]);

    const handleClose = () => {
        setOpen(false);

        // Remove order_fail from URL without reloading
        const queryParams = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost').searchParams;
        queryParams.delete('order_fail');

        const newUrl = queryParams.toString() ? `${window.location.pathname}?${queryParams.toString()}` : window.location.pathname;

        router.visit(newUrl, { replace: false, preserveState: true, preserveScroll: true });
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
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <XCircle className="stroke-red-600" size={40} />
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                        <p className="text-base font-semibold text-gray-600 dark:text-gray-400">{sub_title}</p>
                        <p className="text-base text-gray-600 dark:text-gray-400">{description}</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                        <Button onClick={handleClose} variant="outline">
                            Close
                        </Button>
                        <Link href={`/contact-us`}>
                            <Button variant="default" className="bg-red-500 hover:bg-red-600">
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
