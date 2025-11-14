import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useTranslation from '@/hooks/use-translation';
import { useForm } from '@inertiajs/react';
import { Loader, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteButton = ({ deletePath, id }: { deletePath: string; id: number }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(deletePath + id, {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.flash?.success) {
                    toast.success('Success', {
                        description: page.props.flash.success,
                    });
                }
                if (page.props.flash?.error) {
                    toast.error('Error', {
                        description: page.props.flash.error,
                    });
                }
            },
            onError: (e) => {
                toast.error('Error', {
                    description: 'Failed to create.' + JSON.stringify(e, null, 2),
                });
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="text-destructive hover:text-destructive" size="icon">
                                <Trash2Icon />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>{t('Delete')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('Are you sure?')}</DialogTitle>
                    <DialogDescription>
                        {t('This action cannot be undone. This will permanently delete and remove its data from the servers.')}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        onClick={handleDelete}
                        autoFocus
                        className="ring-primary focus:ring-2 focus:ring-offset-2"
                        disabled={processing}
                        variant="destructive"
                    >
                        {processing && (
                            <span className="animate-spin">
                                <Loader />
                            </span>
                        )}
                        {processing ? t('Deleting') : t('Delete')}
                    </Button>
                    <Button onClick={() => setIsOpen(false)} disabled={processing} variant="secondary" className='border border-foreground'>
                        {t('Cancel')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteButton;
