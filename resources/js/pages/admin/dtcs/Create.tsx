import MyDialogCancelButton from '@/components/my-dialog-cancel-button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { CloudUpload, Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    code: z.string().min(1).max(255),
    short_description: z.string().max(2000).optional(), // 👈 allow longer text
    short_description_kh: z.string().max(2000).optional(), // 👈 allow longer text
    status: z.string().optional(),
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
            code: editData?.code || '',
            short_description: editData?.short_description || '',
            short_description_kh: editData?.short_description_kh || '',
            // status: editData?.status || 'active',
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
                post('/admin/dtcs/' + editData.id + '/update', {
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
                post('/admin/dtcs', {
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
                <div className="col-span-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('Code')}</FormLabel>
                                <FormControl>
                                    <Input autoFocus placeholder="Code" type="text" {...field} />
                                </FormControl>
                                <FormMessage>{errors.code && <div>{errors.code}</div>}</FormMessage>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="short_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Short Description')}</FormLabel>
                                    <FormControl>
                                        <AutosizeTextarea
                                            placeholder="Short Description"
                                            rows={3} // 👈 This makes it 3 lines
                                            className="w-full rounded-md border border-gray-300 p-2" // styling like input
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {errors.short_description && <div>{errors.short_description}</div>}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="short_description_kh"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Short Description Khmer')}</FormLabel>
                                    <FormControl>
                                        <AutosizeTextarea
                                            placeholder="Short Description Khmer"
                                            rows={3} // 👈 This makes it 3 lines
                                            className="w-full rounded-md border border-gray-300 p-2" // styling like input
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {errors.short_description_kh && <div>{errors.short_description_kh}</div>}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

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
