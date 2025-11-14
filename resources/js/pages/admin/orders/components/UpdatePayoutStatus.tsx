import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const UpdatePayoutStatus = () => {
    const { order_detail } = usePage().props;
    const { post, processing } = useForm();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handlePayout = () => {
        post(`/orders/${order_detail.id}/payout`, {
            preserveScroll: true,
            onSuccess: (page) => {
                page.props.flash?.success &&
                    toast.success('Success', {
                        description: page.props.flash?.success || 'Payout completed!',
                    });
                page.props.flash?.warning &&
                    toast.warning('Warning', {
                        description: page.props.flash?.warning || 'Something wrong!',
                    });
                page.props.flash?.error &&
                    toast.error('Error', {
                        description: page.props.flash?.error || 'Something wrong!',
                    });
                setIsDialogOpen(false);
            },
            onError: (errors) => {
                toast.error('Error', {
                    description: 'Failed to payout: ' + JSON.stringify(errors),
                });
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="cursor-pointer transition-all duration-300 hover:scale-105">
                <StatusBadge status={order_detail?.payout_status} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Payout Status</DialogTitle>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button onClick={handlePayout} disabled={processing}>
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <LoaderIcon className="h-5 w-5 animate-spin" />
                                    Payoutting...
                                </span>
                            ) : (
                                'Payout to Shop'
                            )}
                        </Button>
                        <DialogClose>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default UpdatePayoutStatus;
