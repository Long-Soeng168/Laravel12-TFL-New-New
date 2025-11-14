import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTranslation from '@/hooks/use-translation';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import { FilePlus2Icon, FolderCogIcon, FolderPlusIcon, FolderXIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useFileManager } from '../hooks/FileManagerContext';

const ActionDropdown = ({ setOpenUploadFileDialog, setOpenAddFolderDialog }) => {
    const { t } = useTranslation();
    const { currentFolder, setCurrentFolder, setPage } = useFileManager();

    const { delete: destroy, progress, processing, errors } = inertiaUseForm();
    function handleDeleteCurrentFolder() {
        if (!currentFolder) {
            toast.warning('Cannot Delete Root Folder');
            return;
        }

        // Confirmation dialog
        if (!window.confirm(`Are you sure you want to delete the folder "${currentFolder.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            // toast(JSON.stringify(values, null, 2));
            destroy('/api/file_manager/folders/' + currentFolder?.id, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        toast.success('Success', {
                            description: page.props.flash.success,
                        });
                    }
                },
                onError: (e) => {
                    toast.error('Error: Upload Failed', {
                        description: 'Something went wrong.',
                    });
                },
                onFinish: () => {
                    setPage(1);
                    setCurrentFolder(null);
                },
            });
        } catch (error) {
            console.error('Form submission error', error);
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <span className="rounded-xl border p-1">
                    <Button variant="outline" size="icon">
                        <FolderCogIcon className="stroke-foreground/60" />
                    </Button>
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>{t('Action')}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setOpenUploadFileDialog(true)}>
                        <FilePlus2Icon className="stroke-primary" /> {t('Upload Files')}
                        <DropdownMenuShortcut>⌘u</DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setOpenAddFolderDialog(true)}>
                        <FolderPlusIcon className="stroke-yellow-500" /> {t('Add Sub-Folder')}
                        <DropdownMenuShortcut>⌘i</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => setOpenEditFolderNameDialog(true)}>
                                                    <FolderPenIcon />
                                                    Edit Name
                                                    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                                                </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteCurrentFolder()} className="text-red-600">
                        <FolderXIcon className="stroke-red-600" /> {t('Delete Current Folder')}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionDropdown;
