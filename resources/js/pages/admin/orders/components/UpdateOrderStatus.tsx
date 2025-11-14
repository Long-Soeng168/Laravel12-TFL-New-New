import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const UpdateOrderStatus = () => {
    const { order_detail } = usePage().props;
    const { post, data, processing } = useForm();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order_detail?.status);

    const statuses = [
        'pending', 
        'paid', 
        'shipped', 
        'completed', 
        // 'cancelled', 
        // 'refunded'
    ];

    const handleUpdateStatus = () => {
        data.status = selectedStatus;

        post(`/orders/${order_detail.id}/status`, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: (page) => {
                page.props.flash?.success &&
                    toast.success('Success', {
                        description: page.props.flash?.success || 'Order status updated!',
                    });
                page.props.flash?.warning &&
                    toast.warning('Warning', {
                        description: page.props.flash?.warning || 'Something went wrong!',
                    });
                page.props.flash?.error &&
                    toast.error('Error', {
                        description: page.props.flash?.error || 'Something went wrong!',
                    });
                setIsDialogOpen(false);
            },
            onError: (errors) => {
                toast.error('Error', {
                    description: 'Failed to update status: ' + JSON.stringify(errors),
                });
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="cursor-pointer transition-all duration-300 hover:scale-105">
                <StatusBadge status={order_detail?.status} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                </DialogHeader>

                {/* Radio group */}
                <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus} className="mt-4 flex flex-wrap items-center gap-4">
                    {statuses.map((status) => (
                        <div className="flex items-center gap-1">
                            <RadioGroupItem value={status} id={status} className="h-6 w-6 [&_svg]:h-4 [&_svg]:w-4" />
                            <Label htmlFor={status} className="capitalize">
                                <StatusBadge status={status} />
                            </Label>
                        </div>
                    ))}
                </RadioGroup>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2">
                    <Button onClick={handleUpdateStatus} disabled={processing}>
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <LoaderIcon className="h-5 w-5 animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            'Update Status'
                        )}
                    </Button>
                    <DialogClose>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateOrderStatus;
