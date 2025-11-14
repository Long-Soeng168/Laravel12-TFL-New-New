import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { CloudUpload, Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().max(255),
    name_kh: z.string().max(255).optional(),
    address: z.string().max(500).optional(),
    address_kh: z.string().max(500).optional(),
    phone: z.string().max(255).optional(),
    landline_phone: z.string().max(255).optional(),
    working_hours: z.string().max(255).optional(),
    working_hours_kh: z.string().max(255).optional(),
    working_days: z.string().max(255).optional(),
    working_days_kh: z.string().max(255).optional(),
    email: z.string().optional(),
    google_map: z.string().max(500).optional(),
    copyright: z.string().optional(),
    copyright_kh: z.string().optional(),
    image: z.string().optional(),
});

export default function Create() {
    const hasPermission = usePermission();
    const { t } = useTranslation();

    const [files, setFiles] = useState<File[] | null>(null);
    const { editData } = usePage().props;
    const dropZoneConfig = {
        maxFiles: 100,
        maxSize: 1024 * 1024 * 2, // 2MB
        multiple: false,
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
            name: editData?.name || '',
            name_kh: editData?.name_kh || '',
            address: editData?.address || '',
            address_kh: editData?.address_kh || '',
            phone: editData?.phone || '',
            landline_phone: editData?.landline_phone || '',
            working_hours: editData?.working_hours || '',
            working_hours_kh: editData?.working_hours_kh || '',
            working_days: editData?.working_days || '',
            working_days_kh: editData?.working_days_kh || '',
            email: editData?.email || '',
            google_map: editData?.google_map || '',
            copyright: editData?.copyright || '',
            copyright_kh: editData?.copyright_kh || '',
        },
    });

    const { post, progress, processing, transform, errors } = inertiaUseForm();

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
                post('/admin/application_info/' + editData.id + '/update', {
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
                            description: 'Failed to update.' + JSON.stringify(e, null, 2),
                        });
                    },
                });
            } else {
                post('/admin/application_info', {
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
                            description: 'Failed to update.' + JSON.stringify(e, null, 2),
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Name')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Name')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.name && <div>{errors.name}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="name_kh"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Name Khmer')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Name Khmer')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.name_kh && <div>{errors.name_kh}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Address')}</FormLabel>
                            <FormControl>
                                <AutosizeTextarea placeholder={t('Address')} className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage>{errors.address && <div>{errors.address}</div>}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address_kh"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Address Khmer')}</FormLabel>
                            <FormControl>
                                <AutosizeTextarea placeholder={t('Address Khmer')} className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage>{errors.address_kh && <div>{errors.address_kh}</div>}</FormMessage>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="google_map"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Google Map Embed')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Google Map Embed')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.google_map && <div>{errors.google_map}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Phone Number')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Phone Number')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.phone && <div>{errors.phone}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="landline_phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Landline Phone')}</FormLabel>
                                    <FormControl>
                                        <AutosizeTextarea placeholder={t('Landline Phone')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.landline_phone && <div>{errors.landline_phone}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Email')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Email')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.email && <div>{errors.email}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="working_hours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Working Hours')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Working Hours')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.working_hours && <div>{errors.working_hours}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="working_hours_kh"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Working Hours Khmer')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Working Hours Khmer')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.working_hours_kh && <div>{errors.working_hours_kh}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="working_days"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Working Days')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Working Days')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.working_days && <div>{errors.working_days}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="working_days_kh"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Working Days Khmer')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Working Days Khmer')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.working_days_kh && <div>{errors.working_days_kh}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="copyright"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Copyright')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Copyright')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.copyright && <div>{errors.copyright}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="copyright_kh"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Copyright Khmer')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Copyright Khmer')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.copyright_kh && <div>{errors.copyright_kh}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Select Logo')}</FormLabel>
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
                            {/* Initial Image */}
                            {editData?.image && (
                                <div className="mt-4 p-1">
                                    <FormDescription className="mb-2">{t('Uploaded Logo')}</FormDescription>
                                    <div className="grid w-full grid-cols-3 gap-2 rounded-md lg:grid-cols-5">
                                        <span
                                            key={editData?.image}
                                            className="group bg-background relative aspect-square h-auto w-full overflow-hidden rounded-md border p-0"
                                        >
                                            <img
                                                src={'/assets/images/application_info/thumb/' + editData?.image}
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
                {hasPermission('application_info update') && (
                    <Button disabled={processing} type="submit">
                        {processing && (
                            <span className="size-6 animate-spin">
                                <Loader />
                            </span>
                        )}
                        {processing ? t('Submitting') : t('Submit')}
                    </Button>
                )}
            </form>
        </Form>
    );
}
