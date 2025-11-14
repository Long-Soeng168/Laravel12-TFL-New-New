import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router, usePage } from '@inertiajs/react';
import { CircleSlash2, CircleXIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CancelDialog({
    title = 'Cancelled!',
    sub_title = '',
    description = 'You have cancelled your order.',
}: {
    title?: string;
    sub_title?: string;
    description?: string;
}) {
    const { url } = usePage(); // SSR-safe
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!url) return;

        // Parse query params from Inertia URL (works SSR-safe)
        const queryParams = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost').searchParams;
        if (queryParams.get('user_cancel') === '1') {
            setOpen(true);
        }
    }, [url]);

    const handleClose = () => {
        setOpen(false);

        // Remove user_cancel from URL without reloading
        const queryParams = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost').searchParams;
        queryParams.delete('user_cancel');
        const newUrl = queryParams.toString() ? `${window.location.pathname}?${queryParams.toString()}` : window.location.pathname;

        router.visit(newUrl, { replace: false, preserveState: true, preserveScroll: true });
    };

    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle hidden />
                    <DialogDescription hidden />
                </DialogHeader>
                <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-green-900/30">
                        <CircleXIcon className="stroke-yellow-600" size={40} />
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                        <p className="text-base font-semibold text-gray-600 dark:text-gray-400">{sub_title}</p>
                        <p className="text-base text-gray-600 dark:text-gray-400">{description}</p>
                    </div>

                    <div className="pt-2">
                        <Button onClick={handleClose} variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                            Continue
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
