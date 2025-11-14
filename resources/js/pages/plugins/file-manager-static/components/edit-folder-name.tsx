import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useTranslation from '@/hooks/use-translation';
import { FolderIcon } from 'lucide-react';

export function EditFolderName({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { t } = useTranslation();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="link" className="focus-visible:border-none focus-visible:ring-0" size="icon">
                                <FolderPlusIcon />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add Folder</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Edit')}</DialogTitle>
                    <DialogDescription className="flex">
                        <span className="mr-1 font-semibold whitespace-nowrap">Path : </span>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <strong>/</strong>
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>All Images</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <strong>/</strong>
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>About Images</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="items-center gap-4">
                        <Label htmlFor="name" className="flex items-center gap-1 pb-2 text-right">
                            <FolderIcon size={18} /> Name
                        </Label>
                        <Input id="name" value="" placeholder="Folder Name" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">{t('Submit')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
