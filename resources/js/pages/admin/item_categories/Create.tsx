import MySpinner from '@/components/customized/spinner/my-spinner';
import MyDialogCancelButton from '@/components/my-dialog-cancel-button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import axios from 'axios';
import { Check, ChevronsUpDown, CloudUpload, Loader, Paperclip } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().min(1).max(255),
    name_kh: z.string().max(255).optional(),
    code: z.string().min(1).max(255),
    status: z.string().max(255).optional(),
    order_index: z.string().max(255).optional(),
    short_description: z.string().max(500).optional(),
    short_description_kh: z.string().max(500).optional(),
    parent_code: z.string().max(255).optional(),
    image: z.string().optional(),
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
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: editData?.name || '',
            name_kh: editData?.name_kh || '',
            code: editData?.code || '',
            status: editData?.status || 'active',
            short_description: editData?.short_description || '',
            short_description_kh: editData?.short_description_kh || '',
            order_index: editData?.order_index?.toString() || '',
            parent_code: editData?.parent_code || '',
            image: '',
            banner: '',
        },
    });

    const [parentsTableData, setParentsTableData] = useState([]);
    const [isGettingParentsTableData, setIsGettingParentsTableData] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsGettingParentsTableData(true);
        getParentsTableData();
        // Fetch data from the Laravel API route
    }, []);

    function getParentsTableData() {
        axios
            .get('/admin/all_item_categories')
            .then((response) => {
                console.log(response.data);
                setIsGettingParentsTableData(false);
                setParentsTableData(response.data);
            })
            .catch((error) => {
                setError(error);
            });
    }

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
                post('/admin/item_categories/' + editData?.id + '/update', {
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
                    onFinish: () => {
                        setIsGettingParentsTableData(true);
                        getParentsTableData();
                    },
                });
            } else {
                post('/admin/item_categories', {
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
                    onFinish: () => {
                        setIsGettingParentsTableData(true);
                        getParentsTableData();
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Name')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("Name")} type="text" {...field} />
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
                                        <Input placeholder={t("Name Khmer")} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.name_kh && <div>{errors.name_kh}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Unique Code')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex: TOPNAV" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.code && <div>{errors.code}</div>}</FormMessage>
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
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="order_index"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Order Index')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex: 1" type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>{t('Lower number is priority')}</FormDescription>
                                    <FormMessage>{errors.order_index && <div>{errors.order_index}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="parent_code"
                            render={({ field }) => (
                                <FormItem className="flex flex-col" key={field.value}>
                                    <FormLabel>{t('Parent')}</FormLabel>
                                    <Popover>
                                        {isGettingParentsTableData ? (
                                            <MySpinner />
                                        ) : (
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                    >
                                                        {field.value
                                                            ? parentsTableData.find((item) => item.code === field.value)?.name
                                                            : t('Select')}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                        )}

                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder={t("Search")} />
                                                <CommandList>
                                                    <CommandEmpty>{t('No data')}</CommandEmpty>
                                                    <CommandGroup>
                                                        <CommandItem
                                                            value=""
                                                            onSelect={() => {
                                                                form.setValue('parent_code', '');
                                                            }}
                                                        >
                                                            <Check className={cn('mr-2 h-4 w-4', '' === field.value ? 'opacity-100' : 'opacity-0')} />
                                                            {t('Select')}
                                                        </CommandItem>
                                                        {parentsTableData?.map((item) => {
                                                            if (item.id === editData?.id) return null;
                                                            return (
                                                                <CommandItem
                                                                    value={item.name + item.code}
                                                                    key={item.code}
                                                                    onSelect={() => {
                                                                        form.setValue('parent_code', item.code);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            item.code === field.value ? 'opacity-100' : 'opacity-0',
                                                                        )}
                                                                    />
                                                                    {`${item.order_index} ${item.name}`}
                                                                </CommandItem>
                                                            );
                                                        })}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>{t('Select the parent this item belongs to.')}</FormDescription>
                                    <FormMessage>{errors.parent_code && <div>{errors.parent_code}</div>}</FormMessage>
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
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Image')}</FormLabel>
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
                                                src={'/assets/images/item_categories/thumb/' + editData?.image}
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
                                                src={'/assets/images/item_categories/thumb/' + editData?.banner}
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
