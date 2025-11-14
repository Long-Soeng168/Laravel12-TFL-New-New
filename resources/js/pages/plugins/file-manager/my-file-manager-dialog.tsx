import { MyTooltipButton } from '@/components/my-tooltip-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { FoldersIcon, RotateCw, XIcon } from 'lucide-react';
import * as React from 'react';
import ActionDropdown from './components/action-dropdown';
import ActionTop from './components/action-top';
import { AddFiles } from './components/add-files';
import { AddFolder } from './components/add-folder';
import FileTableData from './components/files-table-data';
import Filter from './components/filter';
import SearchInput from './components/search-input';
import SidebarTree from './components/sidebar-tree';
import TopBreadcrumb from './components/top-breadcrumb';
import { useFileManager } from './hooks/FileManagerContext';

export function MyFileManagerDialog({
    handleInsertMedia,
    toolbarContainerId,
}: {
    handleInsertMedia?: (type: 'image' | 'file', url: string, fileName?: string) => void;
    toolbarContainerId?: string;
}) {
    const { t } = useTranslation();
    const hasPermission = usePermission();

    const [openUploadFileDialog, setOpenUploadFileDialog] = React.useState(false);
    const [openAddFolderDialog, setOpenAddFolderDialog] = React.useState(false);
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'u' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenUploadFileDialog((open) => !open);
            }
            if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenAddFolderDialog((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const { handleRefresh, isOpenFileManager, setIsOpenFileManager } = useFileManager();

    return (
        <>
            {hasPermission('file_manager create') && (
                <span>
                    <AddFolder open={openAddFolderDialog} setOpen={setOpenAddFolderDialog} />
                    <AddFiles open={openUploadFileDialog} setOpen={setOpenUploadFileDialog} />
                </span>
            )}

            <Dialog modal={true} open={isOpenFileManager}>
                {/* Start Trigger Dialog Button */}
                <DialogTrigger asChild>
                    <button
                        className="text-true-primary hover:bg-true-primary border-l-true-primary max-h-16 cursor-pointer border-l px-2 py-[11px] transition-all duration-300 hover:text-white"
                        onClick={() => setIsOpenFileManager(true)}
                    >
                        <span className="flex items-center gap-2">
                            <FoldersIcon />
                            <span className="hidden font-semibold lg:inline">{t('File Manager')}</span>
                        </span>
                    </button>
                </DialogTrigger>
                {/* End Trigger Dialog Button */}

                {/* {isOpenFileManager && <div className="fixed inset-0 z-50 bg-black/10" />} */}
                <DialogContent className="ring-primary h-[85vh] overflow-hidden p-0 ring-1 ring-offset-4 md:max-h-[800px] md:max-w-[800px] lg:max-w-[900px] dark:ring-offset-1">
                    <DialogTitle className="sr-only"></DialogTitle>
                    <DialogDescription className="sr-only"></DialogDescription>
                    <SidebarProvider className="items-start">
                        {/* Start Left Side */}
                        <SidebarTree />
                        {/* End Left Side */}

                        {/* Start Right Side */}
                        <main className="flex h-[85vh] flex-1 flex-col overflow-hidden">
                            <header className="flex shrink-0 items-center gap-2 border-white/50 pt-2 pb-1 transition-[width,height] ease-linear">
                                <div className="flex w-full items-center justify-between gap-2 px-4 py-2">
                                    {/* Start Top Breadscrumb */}
                                    <div className="flex items-center gap-2">
                                        <Button size="icon" variant="ghost" className="self-start bg-transparent hover:bg-transparent">
                                            <SidebarTrigger />
                                        </Button>
                                        <TopBreadcrumb />
                                    </div>
                                    {/* End Top Breadscrumb */}

                                    {/* Start Dialog action top*/}
                                    <div className="flex items-center gap-2 self-start">
                                        {hasPermission('file_manager create') && (
                                            <ActionTop
                                                setOpenAddFolderDialog={setOpenAddFolderDialog}
                                                setOpenUploadFileDialog={setOpenUploadFileDialog}
                                            />
                                        )}
                                        <span className="h-6 rounded-full border-[1px] bg-gray-400"></span>
                                        <MyTooltipButton title={t('Refresh')} variant={`outline`} size={`icon`} onClick={() => handleRefresh()}>
                                            <RotateCw className="stroke-foreground" />
                                        </MyTooltipButton>
                                        <MyTooltipButton
                                            title={t('Close')}
                                            variant={`outline`}
                                            size={`icon`}
                                            onClick={() => {
                                                // Keep CKEditor Sticky
                                                const toolbarContainer = document.getElementById(toolbarContainerId);
                                                if (toolbarContainer) {
                                                    toolbarContainer.classList.remove('relative'); // Remove relative
                                                    toolbarContainer.classList.add('sticky', 'top-0', 'z-[50]'); // Add sticky and top-0
                                                }
                                                // End Keep CKEditor Sticky
                                                setIsOpenFileManager(false);
                                            }}
                                        >
                                            <XIcon className="stroke-destructive" />
                                        </MyTooltipButton>
                                    </div>
                                    {/* End Dialog action top*/}
                                </div>
                            </header>

                            {/* Start Search and Action */}
                            <div className="flex gap-2 px-4 pb-2">
                                <SearchInput />
                                <div className="flex items-center gap-2">
                                    <Filter />
                                    {hasPermission('file_manager create') && (
                                        <ActionDropdown
                                            setOpenAddFolderDialog={setOpenAddFolderDialog}
                                            setOpenUploadFileDialog={setOpenUploadFileDialog}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* Start Search and Action*/}

                            {/* Start Table Data */}
                            <FileTableData handleInsertMedia={handleInsertMedia} />
                            {/* End Table Data */}
                        </main>
                        {/* End Right Side */}
                    </SidebarProvider>
                </DialogContent>
            </Dialog>
        </>
    );
}
