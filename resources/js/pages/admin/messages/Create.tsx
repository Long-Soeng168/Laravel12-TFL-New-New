import MyDialogCancelButton from '@/components/my-dialog-cancel-button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().max(255).optional(),
    phone: z.string().max(255).optional(),
    email: z.string().max(255).optional(),
    subject: z.string().max(255).optional(),
    message: z.string().max(255).optional(),
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
            name: editData?.name || '',
            phone: editData?.phone || '',
            email: editData?.email || '',
            subject: editData?.subject || '',
            message: editData?.message || '',
        },
    });

    const { post, progress, processing, transform, errors } = inertiaUseForm();
    const { itemBrands } = usePage().props;

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
                post('/admin/item_models/' + editData.id + '/update', {
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
                post('/admin/item_models', {
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
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Name')}</FormLabel>
                                    <FormControl>
                                        <Input autoFocus placeholder="New Name" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.name && <div>{errors.name}</div>}</FormMessage>
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
                                    <FormLabel>{t('Phone')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Phone')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.phone && <div>{errors.phone}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-12">
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
                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Subject')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Subject')} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.subject && <div>{errors.subject}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Message')}</FormLabel>
                                    <FormControl>
                                        <AutosizeTextarea className="h-auto" placeholder={t('Message')} {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.message && <div>{errors.message}</div>}</FormMessage>
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
