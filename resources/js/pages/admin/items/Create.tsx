import DeleteButton from '@/components/delete-button';
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
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { Check, CheckIcon, ChevronsUpDown, CloudUpload, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import BrandSelect from './components/brand-select';
import CategorySelect from './components/category-select';

type Category = any;
type Brand = any;
type Model = any;
type BodyType = any;
type Shop = any;
type YourEditDataType = any;

interface PageProps {
    itemCategories: Category[];
    itemBrands: Brand[];
    itemModels: Model[];
    itemBodyTypes: BodyType[];
    editData: YourEditDataType;
    shops: Shop[];
    readOnly: boolean;
    [key: string]: unknown;
}

const formSchema = z.object({
    name: z.string().min(1).max(255),
    short_description: z.string().optional(),
    price: z.string().optional(),
    code: z.string().max(255).optional(),
    link: z.string().max(255).optional(),
    status: z.string().optional(),
    source: z.string().optional(),
    category_code: z.string().optional(),
    shop_id: z.any().optional(),
    brand_code: z.string().optional(),
    model_code: z.string().optional(),
    body_type_code: z.string().optional(),
    post_date: z.coerce.date().optional(),
    images: z.string().optional(),
});

export default function Create() {
    // ===== Start Our Code =====
    const { t } = useTranslation();
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

    const { post, progress, processing, transform, errors } = inertiaUseForm();
    const { itemBrands, itemSizes, editData, shops, colors, readOnly } = usePage<any>().props;

    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    useEffect(() => {
        if (editData?.colors_with_details?.length) {
            const selected = editData.colors_with_details.map((child: any) => child.code);
            setSelectedValues(selected);
        }

        if (editData?.sizes_with_details?.length) {
            const selected = editData.sizes_with_details.map((child: any) => child.code);
            setSelectedSizes(selected);
        }
    }, [editData]);

    const [files, setFiles] = useState<File[] | null>(null);
    const [long_description, setLong_description] = useState(editData?.long_description || '');
    const [editorKey, setEditorKey] = useState(0);

    const [finalCategorySelect, setFinalCategorySelect] = useState<any>(null);
    const [finalBrandSelect, setFinalBrandSelect] = useState<any>(null);
    const [filteredBrands, setFilteredBrands] = useState<any>(null);

    const [filteredSizes, setFilteredSizes] = useState<any>(null);

    useEffect(() => {
        setFinalCategorySelect(editData?.category);
        setFinalBrandSelect(editData?.brand);
    }, [editData]);

    // 🔥 Filter brands by selected category code
    useEffect(() => {
        const filtered = itemBrands.filter(
            (brand: any) => brand.categories.includes(finalCategorySelect?.code) || brand.categories.includes(finalCategorySelect?.parent_code),
        );
        setFilteredBrands(filtered);

        // ❗ Only reset brand if current selected brand is not in new filtered list
        if (finalBrandSelect && !filtered.some((brand) => brand.code === finalBrandSelect.code)) {
            setFinalBrandSelect(null);
        }

        const sizes_filtered = itemSizes.filter(
            (size: any) => size.categories.includes(finalCategorySelect?.code) || size.categories.includes(finalCategorySelect?.parent_code),
        );
        setFilteredSizes(sizes_filtered);

        // Clear selections that are no longer in filtered sizes
        if (selectedSizes.length > 0) {
            const validSelections = selectedSizes.filter((code: any) => sizes_filtered.some((size: any) => size.code === code));
            setSelectedSizes(validSelections);
        }
    }, [finalCategorySelect, itemBrands, itemSizes]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: editData?.name || '',
            code: editData?.code || '',
            price: editData?.price?.toString() || '',
            short_description: editData?.short_description || '',
            link: editData?.link || '',
            status: editData?.status || 'active',
            category_code: editData?.category_code?.toString() || '',
            shop_id: editData?.shop_id?.toString() || '',
            brand_code: editData?.brand_code?.toString() || '',
            model_code: editData?.model_code?.toString() || '',
            body_type_code: editData?.body_type_code?.toString() || '',
            // post_date: editData?.id ? new Date(editData?.post_date) : new Date(),
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // console.log(values);
            // toast(
            //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            //         <code className="text-white">{JSON.stringify(values, null, 2)}</code>
            //     </pre>,
            // );
            // return;
            transform(() => ({
                ...values,
                long_description: long_description,
                category_code: finalCategorySelect?.code || null,
                brand_code: finalBrandSelect?.code || null,
                images: files || null,
                item_colors: selectedValues || [],
                item_sizes: selectedSizes || [],
            }));

            if (editData?.id) {
                post(`/admin/items/${editData?.id}/update`, {
                    preserveScroll: true,
                    onSuccess: (page: any) => {
                        setFiles(null);
                        if (page.props.flash?.success) {
                            toast.success('Success', {
                                description: page.props.flash.success,
                            });
                        }
                        if (page.props.flash?.error) {
                            toast.error('Error', {
                                description: page.props.flash.error,
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
                post('/admin/items', {
                    preserveScroll: true,
                    onSuccess: (page: any) => {
                        form.reset();
                        setLong_description('');
                        setEditorKey((prev) => prev + 1);
                        setFiles(null);
                        setFinalCategorySelect(null);
                        setFinalBrandSelect(null);
                        setSelectedSizes([]);
                        setSelectedValues([]);
                        if (page.props.flash?.success) {
                            toast.success('Success', {
                                description: page.props.flash.success,
                            });
                        }
                        if (page.props.flash?.error) {
                            toast.error('Error', {
                                description: page.props.flash.error,
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
            toast.error('Failed to submit the form. Please try again.' + error);
        }
    }

    const currentBreadcrumb = readOnly ? t('Show') : editData ? t('Edit') : t('Create');
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Items'),
            href: '/admin/items',
        },
        {
            title: currentBreadcrumb,
            href: '#',
        },
    ];
    // ===== End Our Code =====
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-5">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="shop_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col" key={field.value}>
                                    <FormLabel>{t('Shop')}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                >
                                                    {field.value
                                                        ? (() => {
                                                              const shop = shops?.find((shop) => shop.id == field.value);
                                                              return shop ? `${shop.name}` : '';
                                                          })()
                                                        : t('Select shop')}

                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <Command>
                                                <CommandInput placeholder="Search shop..." />
                                                <CommandList>
                                                    <CommandEmpty>{t('No data')}</CommandEmpty>
                                                    <CommandGroup>
                                                        <CommandItem
                                                            value=""
                                                            onSelect={() => {
                                                                form.setValue('shop_id', '');
                                                            }}
                                                        >
                                                            <Check className={cn('mr-2 h-4 w-4', '' == field.value ? 'opacity-100' : 'opacity-0')} />
                                                            {t('Select shop')}
                                                        </CommandItem>
                                                        {shops?.map((shop) => (
                                                            <CommandItem
                                                                value={shop.name}
                                                                key={shop.id}
                                                                onSelect={() => {
                                                                    form.setValue('shop_id', shop.id);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        shop.id === field.value ? 'opacity-100' : 'opacity-0',
                                                                    )}
                                                                />
                                                                {shop.logo && (
                                                                    <img
                                                                        className="size-6 object-contain"
                                                                        src={`/assets/images/shops/thumb/${shop.logo}`}
                                                                    />
                                                                )}
                                                                {shop.name}
                                                                {/* {shop.name_kh && `(${shop.name_kh})`} */}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>{t('Select the shop where this item belong to.')}</FormDescription>
                                    <FormMessage>{errors.shop_id && <div>{errors.shop_id}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Price')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('Price ($)')} type="number" {...field} />
                                        </FormControl>
                                        <FormMessage>{errors.price && <div>{errors.price}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Code')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('Code')} type="text" {...field} />
                                        </FormControl>
                                        <FormDescription>{t('Can use product Barcode.')}</FormDescription>
                                        <FormMessage>{errors.code && <div>{errors.code}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem key={field.value}>
                                        <FormLabel>{t('Status')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12">
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
                    </div>

                    <div className="grid grid-cols-6 gap-4 lg:grid-cols-12">
                        <div className="col-span-6 flex flex-col justify-start gap-2">
                            <FormLabel className="p-0">{t('Category')}</FormLabel>
                            <CategorySelect finalCategorySelect={finalCategorySelect} setFinalCategorySelect={setFinalCategorySelect} />
                            <FormDescription>{t('Select the category where this item belong to.')}</FormDescription>
                            <FormMessage>{errors.category_code && <div>{errors.category_code}</div>}</FormMessage>
                        </div>
                        {filteredBrands?.length > 0 && (
                            <div className="col-span-6 flex flex-col justify-start gap-2">
                                <FormLabel className="p-0">{t('Brand')}</FormLabel>
                                <BrandSelect
                                    finalCategorySelect={finalCategorySelect}
                                    setFinalCategorySelect={setFinalCategorySelect}
                                    finalBrandSelect={finalBrandSelect}
                                    setFinalBrandSelect={setFinalBrandSelect}
                                    filteredBrands={filteredBrands}
                                />
                                <FormDescription>{t('Select the Brand where this item belong to.')}</FormDescription>
                                <FormMessage>{errors.brand_code && <div>{errors.brand_code}</div>}</FormMessage>
                            </div>
                        )}
                    </div>

                    <FormField
                        control={form.control}
                        name="short_description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('Description')}</FormLabel>
                                <FormControl>
                                    <AutosizeTextarea placeholder={t('Description')} className="resize-none whitespace-pre-line" {...field} />
                                </FormControl>
                                <FormMessage>{errors.short_description && <div>{errors.short_description}</div>}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <div className="col-span-12">
                        <FormLabel>{t('Colors Available')}</FormLabel>

                        <div className="my-1 flex flex-wrap gap-2">
                            {colors?.map((item: any) => {
                                const selected = selectedValues.includes(item.code);

                                return (
                                    <div
                                        key={item.code}
                                        onClick={() => {
                                            setSelectedValues(
                                                selected ? selectedValues.filter((v) => v !== item.code) : [...selectedValues, item.code],
                                            );
                                        }}
                                        className={`flex cursor-pointer items-center gap-4 rounded border px-3 py-2 transition ${
                                            selected
                                                ? 'border-blue-500 bg-blue-50 ring-3 ring-blue-500/30 dark:bg-blue-900/20'
                                                : 'border-gray-300 hover:border-gray-400 dark:border-gray-700'
                                        }`}
                                    >
                                        {/* Color box */}
                                        <div
                                            className="flex h-4 w-4 items-center justify-center rounded border border-gray-300"
                                            style={{ backgroundColor: item.code }}
                                        >
                                            {selected && <CheckIcon size={12} className="text-white" />}
                                        </div>

                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <FormMessage>{errors.category_codes && <div>{errors.category_codes}</div>}</FormMessage>

                        <p className="text-xs text-gray-500 dark:text-gray-400">Select the colors this item available.</p>
                    </div>

                    {filteredSizes?.length > 0 && (
                        <div className="col-span-12">
                            <FormLabel>{t('Sizes Available')}</FormLabel>

                            <div className="my-1 flex flex-wrap gap-2">
                                {filteredSizes?.map((size: any) => {
                                    const selected = selectedSizes.includes(size.code); // or size.id if you prefer

                                    return (
                                        <div
                                            key={size.code}
                                            onClick={() => {
                                                setSelectedSizes(
                                                    selected ? selectedSizes.filter((v) => v !== size.code) : [...selectedSizes, size.code],
                                                );
                                            }}
                                            className={`flex cursor-pointer items-center gap-4 rounded border px-3 py-2 transition ${
                                                selected
                                                    ? 'border-blue-500 bg-blue-50 ring-3 ring-blue-500/30 dark:bg-blue-900/20'
                                                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-700'
                                            }`}
                                        >
                                            {/* Color box */}
                                            <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white">
                                                {selected && <CheckIcon size={14} className="stroke-3 text-blue-500" />}
                                            </div>
                                            <span className="text-sm">{size.name}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <FormMessage>{errors.size_codes && <div>{errors.size_codes}</div>}</FormMessage>

                            <p className="text-xs text-gray-500 dark:text-gray-400">Select the sizes this item is available in.</p>
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="images"
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
                                                    &nbsp; or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent className="grid w-full grid-cols-3 gap-2 rounded-md lg:grid-cols-6">
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
                                <FormMessage>{errors.images && <div>{errors.images}</div>}</FormMessage>
                            </FormItem>
                        )}
                    />
                    {/* Initial Image */}
                    {editData?.images?.length > 0 && (
                        <div className="mt-4 p-1">
                            <FormDescription className="mb-2">{t('Uploaded Images')}</FormDescription>
                            <div className="grid w-full grid-cols-3 gap-2 rounded-md lg:grid-cols-6">
                                {editData.images.map((imageObject: any) => (
                                    <>
                                        <span
                                            key={imageObject.id}
                                            className="group bg-background relative aspect-square h-auto w-full overflow-hidden rounded-md border p-0"
                                        >
                                            <img
                                                src={'/assets/images/items/thumb/' + imageObject.image}
                                                alt={imageObject.name}
                                                className="h-full w-full object-contain"
                                            />
                                            <span className="absolute top-1 right-1 group-hover:opacity-100 lg:opacity-0">
                                                <DeleteButton deletePath="/admin/items/images/" id={imageObject.id} />
                                            </span>
                                        </span>
                                    </>

                                    // <FileUploaderItem key={i} index={i}>
                                    //     <Paperclip className="h-4 w-4 stroke-current" />
                                    //     <span>{file.name}</span>
                                    // </FileUploaderItem>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* End Long Description */}
                    {progress && <ProgressWithValue value={progress.percentage} position="start" />}
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
        </AppLayout>
    );
}
