import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import { CloudUpload, Loader, Paperclip } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useFileManager } from '../hooks/FileManagerContext';

const formSchema = z.object({
    filse: z.string().optional(),
});
export function AddFiles({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { t } = useTranslation();
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 100, // Allow up to 100 files
        maxSize: 1024 * 1024 * 10,
        multiple: true, // Allow multiple uploads
        // accept: {
        //     'image/jpeg': ['.jpg', '.jpeg'],
        //     'image/png': ['.png'],
        //     'image/gif': ['.gif'],
        //     'image/svg+xml': ['.svg'],
        //     'image/webp': ['.webp'],
        //     'application/pdf': ['.pdf'],
        //     'application/msword': ['.doc'],
        //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        //     'application/vnd.ms-excel': ['.xls'],
        //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        //     'text/plain': ['.txt'],
        //     'application/json': ['.json'],
        //     'text/csv': ['.csv'],
        //     'application/zip': ['.zip'],
        //     'application/x-rar-compressed': ['.rar'],
        //     'audio/mpeg': ['.mp3'],
        //     'audio/wav': ['.wav'],
        //     'audio/ogg': ['.ogg'],
        //     'video/mp4': ['.mp4'],
        //     'video/webm': ['.webm'],
        //     'video/x-msvideo': ['.avi'],
        // },
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const { post, progress, processing, transform, errors } = inertiaUseForm();
    const { currentFolder, getFileData } = useFileManager();
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            transform(() => ({
                files: files || null,
                folder_id: currentFolder?.id || null,
            }));
            post('/api/file_manager/files', {
                preserveScroll: true,
                onSuccess: (page) => {
                    form.reset();
                    getFileData();
                    if (page.props.flash?.success) {
                        toast.success('Success', {
                            description: page.props.flash.success,
                        });
                    }

                    const warningMessages = page?.props?.flash?.warning;
                    if (warningMessages) {
                        toast.warning('Warning: File(s) Already Exist', {
                            description: (
                                <pre>
                                    {Object.values(warningMessages).map((warn: any, index) => (
                                        <div className="flex" key={index}>
                                            <span className="text-muted-foreground">{index + 1}. </span>
                                            <div className="w-full flex-1 whitespace-normal text-yellow-500">{warn}</div>
                                        </div>
                                    ))}
                                </pre>
                            ),
                        });
                    }
                },
                onError: (e) => {
                    console.log(e);
                    toast.error('Error: Upload Failed', {
                        description: 'Something went wrong.' + JSON.stringify(e, null, 2),
                    });
                },
                onFinish: () => {
                    setFiles(null);
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
                                <FilePlus2Icon />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Upload Files</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-8">
                        <FormField
                            control={form.control}
                            name="filse"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUploader
                                            value={files}
                                            onValueChange={setFiles}
                                            dropzoneOptions={dropZoneConfig}
                                            className="bg-background relative rounded-lg p-0.5"
                                        >
                                            <FileInput id="fileInput" className="outline-1 outline-slate-500 outline-dashed">
                                                <div className="flex w-full flex-col items-center justify-center p-8">
                                                    <CloudUpload className="h-10 w-10 text-gray-500" />
                                                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">{t('Click to upload')}</span>
                                                        &nbsp; {t('or drag and drop')}
                                                    </p>
                                                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                                        {/* <strong>Allowed</strong> : PDF, DOC, DOCX, XLS, XLSX, TXT, CSV, ZIP, RAR, MP3, WAV, MP4, WEBM, SVG,
                                                        PNG, JPG, JPEG, GIF */}
                                                    </p>
                                                </div>
                                            </FileInput>
                                            <FileUploaderContent>
                                                {files &&
                                                    files.length > 0 &&
                                                    files.map((file, i) => (
                                                        <FileUploaderItem key={i} index={i}>
                                                            <Paperclip className="h-4 w-4 stroke-current" />
                                                            <span>{file.name}</span>
                                                        </FileUploaderItem>
                                                    ))}
                                            </FileUploaderContent>
                                        </FileUploader>
                                    </FormControl>
                                    <FormDescription>Max File Size 2MB</FormDescription>
                                    <FormMessage>{errors.files && <div>{errors.files}</div>}</FormMessage>
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
            </DialogContent>
        </Dialog>
    );
}
