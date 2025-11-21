import { MyTooltipButton } from '@/components/my-tooltip-button';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { Loader2, ReceiptTextIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function TransactionDetailDialog({ detail, order_id }: { detail: string; order_id: string }) {
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState(detail);

    const handleRecheck = async () => {
        setLoading(true);

        try {
            const response = await fetch(`/kess/get-order-transaction?order_id=${order_id}`, {
                method: 'GET', // or POST if your callback expects POST
                headers: {
                    Accept: 'application/json',
                },
            });

            const data = await response.json();

            if (data.response) {
                setTransaction(JSON.stringify(data.response, null, 2));
                toast.success('Transaction rechecked successfully');
            } else {
                setTransaction(JSON.stringify(data, null, 2));
                // toast.warning('Recheck completed but no transaction data returned');
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong while rechecking');
        } finally {
            setLoading(false);
            router.reload();
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <MyTooltipButton title={'Transaction Detail'} side="bottom" variant="ghost">
                    <ReceiptTextIcon /> Transaction
                </MyTooltipButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader className="py-0">
                    <DialogTitle className="my-0 flex flex-wrap items-center justify-between py-0">
                        <p>Transaction Detail</p>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <pre className="rounded bg-gray-100 p-4 text-sm whitespace-pre-wrap">
                    {(() => {
                        try {
                            const parsed = typeof transaction === 'string' && transaction.trim() !== '' ? JSON.parse(transaction) : transaction;
                            return JSON.stringify(parsed, null, 2);
                        } catch (e) {
                            return transaction;
                        }
                    })()}
                </pre>

                <DialogFooter>
                    <div className="flex flex-col items-end gap-2">
                        <Button onClick={handleRecheck} disabled={loading} className="flex items-center gap-2">
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Recheck Transaction
                        </Button>
                        <p className="text-xs text-gray-500">Only for transactions within 7 days</p>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
