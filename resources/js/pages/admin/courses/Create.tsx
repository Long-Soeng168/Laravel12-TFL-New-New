import MyDialogCancelButton from '@/components/my-dialog-cancel-button';
import { Button } from '@/components/ui/button';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import { Textarea } from '@/components/ui/textarea';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { CloudUpload, Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    title: z.string().min(1).max(255),
    title_kh: z.string().max(255).optional(),
    image: z.string().optional(), // you might validate as URL if needed
    price: z.coerce.number().nonnegative().default(0), // accept string from input and turn to number
    short_description: z.string().max(1000).optional(),
    short_description_kh: z.string().max(1000).optional(),
    status: z.string().optional(),
    start_at: z.string().optional(), // could validate more if you want valid datetime
    end_at: z.string().optional(),
});

export default function Create({
    editData,
    readOnly,
    setIsOpen,
}: {
    editData?: any;
    readOnly?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    // ===== Start Our Code =====
    const { t } = useTranslation();
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 100,
        maxSize: 1024 * 1024 * 2, // 2MB
        multiple: true,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
            'image/webp': ['.webp'],
        },
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: editData?.title || '',
            title_kh: editData?.title_kh || '',
            image: editData?.image || '',
            price: editData?.price || 0,
            short_description: editData?.short_description || '',
            short_description_kh: editData?.short_description_kh || '',
            status: editData?.status || 'active', // if you want active as default
            start_at: editData?.start_at || '',
            end_at: editData?.end_at || '',
        },
    });

    const { post, progress, processing, transform, errors } = inertiaUseForm();
    const { types } = usePage().props;

    function onSubmit(values: z.infer<typeof formSchema>) {
        // toast(
        //     <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
        //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        //     </pre>
        //   );
        try {
            transform(() => ({
                ...values,
                image: files ? files[0] : null,
            }));
            if (editData?.id) {
                post('/admin/courses/' + editData.id + '/update', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        setFiles(null);
                        if (page.props.flash?.success) {
                            toast.success('Success', {
                                description: page.props.flash.success,
                            });
                        }
                    },
                    onError: (e) => {
                        toast.error('Error', {
                            description: 'Failed to create.' + JSON.stringify(e, null, 2),
                        });
                    },
                });
            } else {
                post('/admin/courses', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        form.reset();
                        setFiles(null);
                        if (page.props.flash?.success) {
                            toast.success('Success', {
                                description: page.props.flash.success,
                            });
                        }
                    },
                    onError: (e) => {
                        toast.error('Error', {
                            description: 'Failed to create.' + JSON.stringify(e, null, 2),
                        });
                    },
                });
            }
        } catch (error) {
            console.error('Form submission error', error);
            toast.error('Error', {
                description: 'Something went wrong!',
            });
        }
    }
    // ===== End Our Code =====

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-10">
                <div className="grid md:grid-cols-12 gap-4">
                    {/* Title */}
                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Title')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Title Khmer */}
                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="title_kh"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Title Khmer')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title Khmer" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                {/* Price */}
                <div className="col-span-6">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('Price')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="Price" type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid md:grid-cols-12 gap-4">
                    {/* Short Description */}
                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="short_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Short Description')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Short description..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Short Description Khmer */}
                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="short_description_kh"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Short Description Khmer')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Short description Khmer..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Start Date */}
                    {/* <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="start_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Start Date')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Start Date" type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div> */}

                    {/* End Date */}
                    {/* <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="end_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('End Date')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="End Date" type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div> */}
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Select Images')}</FormLabel>
                            <FormControl>
                                <FileUploader value={files} onValueChange={setFiles} dropzoneOptions={dropZoneConfig} className="relative p-1">
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
                                    <FileUploaderContent className="grid w-full grid-cols-3 gap-2 rounded-md lg:grid-cols-4">
                                        {files?.map((file, i) => (
                                            <FileUploaderItem
                                                key={i}
                                                index={i}
                                                className="bg-background aspect-square h-auto w-full overflow-hidden rounded-md border p-0"
                                                aria-roledescription={`file ${i + 1} containing ${file.name}`}
                                            >
                                                <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-contain" />
                                            </FileUploaderItem>
                                            // <FileUploaderItem key={i} index={i}>
                                            //     <Paperclip className="h-4 w-4 stroke-current" />
                                            //     <span>{file.name}</span>
                                            // </FileUploaderItem>
                                        ))}
                                    </FileUploaderContent>
                                </FileUploader>
                            </FormControl>
                            <FormMessage>{errors.image && <div>{errors.image}</div>}</FormMessage>

                            {editData?.image && (
                                <div className="mt-4 p-1">
                                    <FormDescription className="mb-2">{t('Uploaded Image')}</FormDescription>
                                    <div className="grid w-full grid-cols-2 gap-2 rounded-md lg:grid-cols-3">
                                        <span
                                            key={editData?.image}
                                            className="group bg-background relative aspect-video h-auto w-full overflow-hidden rounded-md border p-0"
                                        >
                                            <img
                                                src={'/assets/images/courses/thumb/' + editData?.image}
                                                alt={editData?.image}
                                                className="h-full w-full object-contain"
                                            />
                                        </span>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    )}
                />
                {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                {setIsOpen && <MyDialogCancelButton onClick={() => setIsOpen(false)} />}

                {!readOnly && (
                    <Button disabled={processing} type="submit">
                        {processing && (
                            <span className="size-6 animate-spin">
                                <Loader />
                            </span>
                        )}
                        {processing ? t('Submiting') : t('Submit')}
                    </Button>
                )}
            </form>
        </Form>
    );
}
