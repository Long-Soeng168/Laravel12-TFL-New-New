import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import { FolderIcon, Loader } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useFileManager } from '../hooks/FileManagerContext';

const formSchema = z.object({
    name: z.string().min(1).max(255),
});
export function AddFolder({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { t } = useTranslation();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const { getFolderData, currentFolder, setCurrentFolder } = useFileManager();

    const { post, progress, processing, transform, errors } = inertiaUseForm();
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            transform(() => ({
                ...values,
                parent_id: currentFolder?.id || null,
            }));
            // toast(JSON.stringify(values, null, 2));
            post('/api/file_manager/folders', {
                preserveScroll: true,
                onSuccess: (page) => {
                    form.reset();
                    getFolderData();
                    if (page.props.flash?.success) {
                        toast.success('Success', {
                            description: page.props.flash.success,
                        });
                    }
                    if (page.props.flash?.warning) {
                        toast.warning('Warning', {
                            description: page.props.flash.warning,
                        });
                    }
                },
                onError: (e) => {
                    toast.error('Error: Upload Failed', {
                        description: 'Something went wrong.',
                    });
                },
                onFinish: () => {
                    setOpen(false);
                },
            });
        } catch (error) {
            console.error('Form submission error', error);
            // toast.error('Error', {
            //     description: 'Something went wrong!',
            // });
        }
    }

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
                    <DialogTitle>{'Create Folder'}</DialogTitle>
                    <DialogDescription className="flex">
                        <span className="mr-1 font-semibold whitespace-nowrap">Path : </span>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink className="cursor-pointer">Folders</BreadcrumbLink>
                                </BreadcrumbItem>
                                {currentFolder?.path?.length > 0 && <BreadcrumbSeparator />}
                                {currentFolder?.path?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink className="cursor-pointer">{item.name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {index !== currentFolder?.path.length - 1 && <BreadcrumbSeparator />}
                                    </React.Fragment>
                                ))}
                                {currentFolder && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{currentFolder.name}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="items-center gap-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1">
                                                <FolderIcon size={18} /> Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Folder Name" type="text" {...field} />
                                            </FormControl>
                                            <FormMessage>{errors.name && <div>{errors.name}</div>}</FormMessage>
                                        </FormItem>
                                    )}
                                />

                                {progress && <ProgressWithValue value={progress.percentage} position="start" />}
                                <Button disabled={processing} type="button" onClick={() => onSubmit(form.getValues())}>
                                    {processing && (
                                        <span className="size-6 animate-spin">
                                            <Loader />
                                        </span>
                                    )}
                                    {processing ? t('Submitting') : t('Submit')}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
