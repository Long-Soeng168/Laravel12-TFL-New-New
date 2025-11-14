import MyDialogCancelButton from '@/components/my-dialog-cancel-button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    type: z.string().min(1).max(255),
    label: z.string().min(1).max(255),
    type_of: z.string().max(255).optional(),
    status: z.string().max(255).optional(),
    short_description: z.string().max(500).optional(),
    short_description_kh: z.string().max(500).optional(),
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
    const hasPermission = usePermission();
    const [files, setFiles] = useState<File[] | null>(null);
    const [filesBanner, setFilesBanner] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 100,
        maxSize: 1024 * 1024 * 4,
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
            type: editData?.type || '',
            label: editData?.label || '',
            type_of: editData?.type_of || '',
            status: editData?.status || 'active',
            short_description: editData?.short_description || '',
            short_description_kh: editData?.short_description_kh || '',
        },
    });

    const { post, data, progress, processing, transform, errors } = inertiaUseForm();

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
                banner: filesBanner ? filesBanner[0] : null,
            }));
            if (editData?.id) {
                post('/admin/types/' + editData.id + '/update', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        setFiles(null);
                        setFilesBanner(null);
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
                post('/admin/types', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        form.reset();
                        setFiles(null);
                        setFilesBanner(null);
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
                description: 'Something went wrong!' + error,
            });
        }
    }
    // ===== End Our Code =====

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-10">
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem key={field.value}>
                                     <FormLabel>{t('Type')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Name')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.type && <div>{errors.type}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Label')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.label && <div>{errors.label}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="type_of"
                            render={({ field }) => (
                                <FormItem key={field.value}>
                                    <FormLabel>{t('Type Of')}</FormLabel>
                                    <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {hasPermission('page view') && <SelectItem value="page">{t('Page')}</SelectItem>}
                                            {hasPermission('post view') && <SelectItem value="post">{t('Post')}</SelectItem>}
                                            {hasPermission('banner view') && <SelectItem value="banner">{t('Banner')}</SelectItem>}
                                            {hasPermission('link view') && <SelectItem value="link">{t('Link')}</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage>{errors.type_of && <div>{errors.type_of}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem key={field.value}>
                                    <FormLabel>{t('Status')}</FormLabel>
                                    <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">{t('Active')}</SelectItem>
                                            <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage>{errors.status && <div>{errors.status}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Short Description')}</FormLabel>
                            <FormControl>
                                <AutosizeTextarea placeholder={t("Short Description")} className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage>{errors.short_description && <div>{errors.short_description}</div>}</FormMessage>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="short_description_kh"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Short Description Khmer')}</FormLabel>
                            <FormControl>
                                <AutosizeTextarea placeholder={t("Short Description Khmer")} className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage>{errors.short_description_kh && <div>{errors.short_description_kh}</div>}</FormMessage>
                        </FormItem>
                    )}
                /> */}

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}
                {setIsOpen && <MyDialogCancelButton onClick={() => setIsOpen(false)} />}

                {!readOnly && (
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
