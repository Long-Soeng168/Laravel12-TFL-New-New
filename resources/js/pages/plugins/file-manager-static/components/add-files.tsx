import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CloudUpload, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    name_5212946662: z.string(),
});
export function AddFiles({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 100,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>,
            );
        } catch (error) {
            console.error('Form submission error', error);
            toast.error('Failed to submit the form. Please try again.');
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-8">
                        <FormField
                            control={form.control}
                            name="name_5212946662"
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
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">{t('Submit')}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
