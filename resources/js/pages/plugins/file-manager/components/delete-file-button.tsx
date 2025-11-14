import { MyTooltipButton } from '@/components/my-tooltip-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Loader, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useFileManager } from '../hooks/FileManagerContext';

const DeleteFileButton = ({ deletePath, id }: { deletePath: string; id: number }) => {
    const { getFileData } = useFileManager();
    const [isOpen, setIsOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(deletePath + id, {
            preserveScroll: true,
            onSuccess: () => {
                getFileData();
                setIsOpen(false); 
                toast.success('Success', {
                    description: 'File deleted successfully.',
                });
            },
            onError: (error) => {
                toast.error('Error', {
                    description: 'Failed to delete.' + JSON.stringify(error, null, 2),
                });
                setIsOpen(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <MyTooltipButton
                    variant="destructive"
                    size="icon"
                    title="Delete File"
                    className="bg-muted/60 group/destroy h-8 w-8 p-0"
                >
                    <Trash2Icon className="stroke-red-600 group-hover/destroy:stroke-white" />
                </MyTooltipButton>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete and remove its data from the servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)} disabled={processing} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        autoFocus
                        onClick={handleDelete}
                        className="ring-primary focus:ring-2 focus:ring-offset-2"
                        disabled={processing}
                        variant="destructive"
                    >
                        {processing && (
                            <span className="animate-spin">
                                <Loader />
                            </span>
                        )}
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteFileButton;
