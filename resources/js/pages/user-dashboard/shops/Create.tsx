import MyDialogCancelButton from '@/components/my-dialog-cancel-button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { CloudUpload, Loader, Paperclip } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import ContactUsButton from '../components/contact-us-button';
import CategorySelect from './components/category-select';
import ShopSuspended from './components/shop-inactive';
import ShopPending from './components/shop-pending';
import ShopReject from './components/shop-reject';

const formSchema = z.object({
    owner_user_id: z.string(),
    name: z.string().min(1).max(255),
    phone: z.string().max(255),
    address: z.string().max(255),
    bank_account: z.string().max(255),
    status: z.string().max(255).optional(),
    order_index: z.string().max(255).optional(),
    short_description: z.string().max(500),
    short_description_kh: z.string().max(500).optional(),
    logo: z.string().optional(),
    banner: z.string().optional(),
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
    const { auth } = usePage().props;

    const [finalCategorySelect, setFinalCategorySelect] = useState<any>(null);

    useEffect(() => {
        setFinalCategorySelect(editData?.category);
    }, [editData]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: editData?.name || '',
            address: editData?.address || '',
            phone: editData?.phone || '',
            bank_account: editData?.bank_account || '',
            status: editData?.status || 'pending',
            short_description: editData?.short_description || '',
            short_description_kh: editData?.short_description_kh || '',
            order_index: editData?.order_index?.toString() || '',
            owner_user_id: auth?.user?.id?.toString() || '',
            logo: '',
            banner: '',
        },
    });

    const [error, setError] = useState(null);

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
                logo: files ? files[0] : null,
                banner: filesBanner ? filesBanner[0] : null,
                category_code: finalCategorySelect?.code || null,
            }));

            if (editData?.id) {
                post('/user-shops/' + editData?.id + '/update', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        setFiles(null);
                        setFilesBanner(null);
                        setFinalCategorySelect(null);
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
                post('/user-shops', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        form.reset();
                        setFiles(null);
                        setFilesBanner(null);
                        setFinalCategorySelect(null);
                        if (page.props.flash?.success) {
                            toast.success('Success', {
                                description: page.props.flash.success,
                            });
                        }
                    },
                    onError: (e) => {
                        toast.error('Error', {
                            description: 'Failed to register.' + JSON.stringify(e, null, 2),
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

    const currentBreadcrumb = readOnly ? t('Show') : editData ? t('Edit Shop') : t('Register Shop');
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Dashboard'),
            href: '/user-dashboard',
        },
        {
            title: currentBreadcrumb,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {editData?.status == 'inactive' && <ShopSuspended />}
            {editData?.status == 'pending' && <ShopPending />}
            {editData?.status == 'reject' && <ShopReject />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
                    <div className="grid gap-4 md:grid-cols-12">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('Shop Name')} <span className="text-red-500">*</span>
                                        </FormLabel>
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
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('Shop Phone Number')} <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('Phone')} type="number" {...field} />
                                        </FormControl>
                                        <FormMessage>{errors.phone && <div>{errors.phone}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-12">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('Shop Address')} <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('Address')} type="text" {...field} />
                                        </FormControl>
                                        <FormMessage>{errors.address && <div>{errors.address}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-12">
                            <FormField
                                control={form.control}
                                name="bank_account"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('ABA Bank Account')} <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('bank_account')} type="text" {...field} />
                                        </FormControl>
                                        <FormMessage>{errors.bank_account && <div>{errors.bank_account}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="short_description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('Shop Description')}</FormLabel>
                                <FormControl>
                                    <AutosizeTextarea placeholder={t('Description')} className="resize-none" {...field} />
                                </FormControl>
                                <FormMessage>{errors.short_description && <div>{errors.short_description}</div>}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <div className="col-span-6 flex flex-col justify-start gap-2">
                        <FormLabel className="p-0">
                            {t('Shop Category')} <span className="text-red-500">*</span>
                        </FormLabel>
                        <CategorySelect finalCategorySelect={finalCategorySelect} setFinalCategorySelect={setFinalCategorySelect} />
                        <FormDescription>{t('Choose the category that represents your shop’s focus.')}</FormDescription>
                        <FormMessage>{errors.category_code && <div>{errors.category_code}</div>}</FormMessage>
                    </div>

                    {/* <FormField
                        control={form.control}
                        name="short_description_kh"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('Short Description Khmer')}</FormLabel>
                                <FormControl>
                                    <AutosizeTextarea placeholder={t('Short Description Khmer')} className="resize-none" {...field} />
                                </FormControl>
                                <FormMessage>{errors.short_description_kh && <div>{errors.short_description_kh}</div>}</FormMessage>
                            </FormItem>
                        )}
                    /> */}

                    <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t('Logo')} <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={files}
                                        onValueChange={setFiles}
                                        dropzoneOptions={dropZoneConfig}
                                        className="bg-background relative rounded-lg p-2"
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
                                <FormMessage>{errors.logo && <div>{errors.logo}</div>}</FormMessage>
                                {editData?.logo && (
                                    <div className="mt-4 p-1">
                                        <FormDescription className="mb-2">{t('Uploaded Image')}</FormDescription>
                                        <div className="grid w-full grid-cols-2 gap-2 rounded-md lg:grid-cols-3">
                                            <span
                                                key={editData?.logo}
                                                className="group bg-background relative aspect-video h-auto w-full overflow-hidden rounded-md border p-0"
                                            >
                                                <img
                                                    src={'/assets/images/shops/thumb/' + editData?.logo}
                                                    alt={editData?.logo}
                                                    className="h-full w-full object-contain"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="banner"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('Banner')}</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={filesBanner}
                                        onValueChange={setFilesBanner}
                                        dropzoneOptions={dropZoneConfig}
                                        className="bg-background relative rounded-lg p-2"
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
                                            {filesBanner &&
                                                filesBanner.length > 0 &&
                                                filesBanner.map((file, i) => (
                                                    <FileUploaderItem key={i} index={i}>
                                                        <Paperclip className="h-4 w-4 stroke-current" />
                                                        <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                        </FileUploaderContent>
                                    </FileUploader>
                                </FormControl>
                                <FormMessage>{errors.banner && <div>{errors.banner}</div>}</FormMessage>
                                {editData?.banner && (
                                    <div className="mt-4 p-1">
                                        <FormDescription className="mb-2">{t('Uploaded Banner')}</FormDescription>
                                        <div className="grid w-full grid-cols-2 gap-2 rounded-md lg:grid-cols-3">
                                            <span
                                                key={editData?.banner}
                                                className="group bg-background relative aspect-video h-auto w-full overflow-hidden rounded-md border p-0"
                                            >
                                                <img
                                                    src={'/assets/images/shops/thumb/' + editData?.banner}
                                                    alt={editData?.banner}
                                                    className="h-full w-full object-contain"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />

                    {/* Agreement Checkbox */}
                    <div>
                        <FormItem className="mt-4 flex items-center space-x-1">
                            <FormControl>
                                <input
                                    required
                                    type="checkbox"
                                    id="agreement"
                                    className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                                />
                            </FormControl>
                            <FormLabel htmlFor="agreement" className="text-sm leading-tight">
                                {t('I agree to the')}{' '}
                                <a
                                    href="/shop-terms-and-conditions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline hover:no-underline"
                                >
                                    {t('Terms and Conditions')}
                                </a>{' '}
                            </FormLabel>
                            <FormMessage>{errors.agreement && <div>{errors.agreement}</div>}</FormMessage>
                        </FormItem>
                    </div>

                    {progress && <ProgressWithValue value={progress.percentage} position="start" />}
                    {setIsOpen && <MyDialogCancelButton onClick={() => setIsOpen(false)} />}

                    {(!editData || editData?.status == 'active') && (
                        <>
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
                        </>
                    )}
                    {editData && editData?.status == 'reject' && (
                        <>
                            <p className="font-bold text-red-400">{t('Shop Registration Rejected.')}</p>
                            <ContactUsButton />
                        </>
                    )}
                    {editData && editData?.status == 'pending' && (
                        <>
                            <p className="font-bold text-yellow-500">{t('Shop Pending Approval.')}</p>
                            <ContactUsButton />
                        </>
                    )}
                    {editData && editData?.status == 'inactive' && (
                        <>
                            <p className="font-bold text-gray-500">{t('Shop Suspended.')}</p>
                            <ContactUsButton />
                        </>
                    )}
                </form>
            </Form>
        </AppLayout>
    );
}
