import MyDialogCancelButton from '@/components/my-dialog-cancel-button';
import { Button } from '@/components/ui/button';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { CloudUpload, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import MultipleSelector, { Option } from '@/components/ui/multiple-selector';

// const GROUP_OPTIONS: Option[] = [
//     { label: 'nextjs', value: 'nextjs', group: 'React' },
//     { label: 'React', value: 'react', group: 'React' },
//     { label: 'Remix', value: 'remix', group: 'React' },
//     { label: 'shadcn-ui', value: 'shadcn-ui', group: 'React' },
//     { label: 'mui', value: 'mui', group: 'React' },
//     { label: 'Vite', value: 'vite', group: 'Vue' },
//     { label: 'Nuxt', value: 'nuxt', group: 'Vue' },
//     { label: 'Vue', value: 'vue', group: 'Vue' },
//     { label: 'Quasar', value: 'quasar', group: 'Vue' },
//     { label: 'Angular', value: 'angular', group: 'Angular' },
//     { label: 'Material UI', value: 'material-ui', group: 'Angular' },
//     { label: 'Ng-zorro', value: 'ng-zorro', group: 'Angular' },
// ];

const formSchema = z.object({
    code: z.string(),
    name: z.string().min(1).max(255).optional(),
    name_kh: z.string().max(255).optional(),
    order_index: z.string().optional(),
    image: z.string().optional(),
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

    const [selectedValues, setSelectedValues] = useState<Option[]>([]);

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
            name: editData?.name || '',
            name_kh: editData?.name_kh || '',
            order_index: editData?.order_index?.toString() || '',
            image: editData?.image || '',
        },
    });

    const { post, progress, processing, transform, errors } = inertiaUseForm();
    const { item_categories } = usePage().props;

    useEffect(() => {
        if (editData?.categories?.length) {
            const selected = editData.categories.map((child: any) => ({
                label: child.name,
                value: child.code,
                group: null, // or use a default string if needed
            }));
            setSelectedValues(selected);
        }
    }, [editData]);

    const GROUP_OPTIONS = item_categories?.flatMap((parent) =>
        (parent.children || []).map((child) => ({
            label: parent.name + ' | ' + child.name,
            value: child.code,
            group: parent.name,
        })),
    );

    function onSubmit(values: z.infer<typeof formSchema>) {
        // toast(
        //     <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
        //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        //     </pre>
        //   );
        try {
            transform(() => ({
                ...values,
                category_codes: selectedValues || [],
                image: files ? files[0] : null,
            }));
            if (editData?.id) {
                post('/admin/item_colors/' + editData.id + '/update', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        setFiles(null);
                        setSelectedValues([]);
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
                post('/admin/item_colors', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        form.reset();
                        setFiles(null);
                        setSelectedValues([]);

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
                <div className="grid gap-4 md:grid-cols-12">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Code')}</FormLabel>
                                    <FormControl>
                                        <Input autoFocus placeholder="New Code" type="color" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.code && <div>{errors.code}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="order_index"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Order Index')}</FormLabel>
                                    <FormControl>
                                        <Input autoFocus placeholder="Order Index" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.order_index && <div>{errors.order_index}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
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
                    {/* <div className="col-span-12">
                        <FormLabel>{t('Categories')}</FormLabel>
                        <MultipleSelector
                            className="my-1"
                            groupBy="group"
                            value={selectedValues}
                            onChange={setSelectedValues}
                            defaultOptions={GROUP_OPTIONS}
                            placeholder="Select categories..."
                            emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">no results found.</p>}
                        />
                        <FormMessage>{errors.category_codes && <div>{errors.category_codes}</div>}</FormMessage>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Select the categories this brand belongs to.</p>
                    </div> */}
                </div>
                {/* <FormField
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
                                                src={'/assets/images/item_colors/thumb/' + editData?.image}
                                                alt={editData?.image}
                                                className="h-full w-full object-contain"
                                            />
                                        </span>
                                    </div>
                                </div>
                            )}
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
                        {processing ? t('Submiting') : t('Submit')}
                    </Button>
                )}
            </form>
        </Form>
    );
}
