import DeleteButton from '@/components/delete-button';
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
import MyCkeditor5 from '@/pages/plugins/ckeditor5/my-ckeditor5';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, CloudUpload, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    title: z.string().min(1).max(255),
    code: z.string().max(255).optional(),
    title_kh: z.string().max(255).optional(),
    // short_description: z.string().max(500).optional(),
    // short_description_kh: z.string().max(500).optional(),
    link: z.string().max(255).optional(),
    source: z.string().max(255).optional(),
    type: z.string().optional(),
    order_index: z.string().max(255).optional(),
    status: z.string().optional(),
    parent_id: z.string().optional(),
    position_code: z.string().optional(),
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
    const { parentData, types, pagePositions, editData, readOnly, links } = usePage().props;

    const [disableCodeField, setdisableCodeField] = useState(false);
    const [files, setFiles] = useState<File[] | null>(null);
    const [long_description, setLong_description] = useState(editData?.long_description || '');
    const [long_description_kh, setLong_description_kh] = useState(editData?.long_description_kh || '');
    const [short_description, setShort_description] = useState(editData?.short_description || '');
    const [short_description_kh, setShort_description_kh] = useState(editData?.short_description_kh || '');
    const [editorKey, setEditorKey] = useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: editData?.title || '',
            code: editData?.code || '',
            title_kh: editData?.title_kh || '',
            // short_description: editData?.short_description || '',
            // short_description_kh: editData?.short_description_kh || '',
            link: editData?.link || '',
            source: editData?.source?.toString() || '',
            type: editData?.type || 'content',
            order_index: editData?.order_index?.toString() || '',
            status: editData?.status || 'active',
            parent_id: editData?.parent_id?.toString() || '',
            position_code: editData?.position_code?.toString() || pagePositions[0]?.code || '',
        },
    });

    useEffect(() => {
        // editData?.code && setdisableCodeField(true);
    }, []);

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // console.log(values);
            // toast(
            //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            //         <code className="text-white">{JSON.stringify(values, null, 2)}</code>
            //     </pre>,
            // );
            transform(() => ({
                ...values,
                long_description: long_description,
                long_description_kh: long_description_kh,
                short_description: short_description,
                short_description_kh: short_description_kh,
                images: files || null,
            }));

            if (editData?.id) {
                post(`/admin/pages/${editData?.id}/update`, {
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
                post('/admin/pages', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        form.reset();
                        setLong_description('');
                        setLong_description_kh('');
                        setShort_description('');
                        setShort_description_kh('');
                        setEditorKey((prev) => prev + 1);
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
            toast.error('Failed to submit the form. Please try again.' + error);
        }
    }

    const currentBreadcrumb = readOnly ? t('Show') : editData ? t('Edit') : t('Create');
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Pages'),
            href: '/admin/pages',
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
                    <div className="grid md:grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Unique Code')}</FormLabel>
                                        <FormControl>
                                            <Input disabled={disableCodeField} placeholder={t('Code')} type="text" {...field} />
                                        </FormControl>
                                        <FormMessage>{errors.code && <div>{errors.code}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Title')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('Title')} type="text" {...field} />
                                        </FormControl>
                                        <FormMessage>{errors.title && <div>{errors.title}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="title_kh"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Title Khmer')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('Title Khmer')} type="text" {...field} />
                                        </FormControl>
                                        <FormMessage>{errors.title_kh && <div>{errors.title_kh}</div>}</FormMessage>
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
                                    <AutosizeTextarea placeholder={t('Short Description')} className="resize-none" {...field} />
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
                                    <AutosizeTextarea placeholder={t('Short Description Khmer')} className="resize-none" {...field} />
                                </FormControl>
                                <FormMessage>{errors.short_description_kh && <div>{errors.short_description_kh}</div>}</FormMessage>
                            </FormItem>
                        )}
                    /> */}
                    {/* Start Short Description */}
                    <div key={'short_description' + editorKey} className="space-y-8">
                        <div>
                            <p className="mb-1 text-sm font-medium">{t('Short Description')}</p>
                            <MyCkeditor5 data={short_description} setData={setShort_description} />
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium">{t('Short Description Khmer')}</p>
                            <MyCkeditor5 data={short_description_kh} setData={setShort_description_kh} />
                        </div>
                    </div>

                    <div className="grid grid-cols-6 gap-4 lg:grid-cols-12">
                        <div className="col-span-6 flex space-x-2">
                            <span>
                                <FormField
                                    control={form.control}
                                    name="source"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('Source')}</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    !editData?.id &&
                                                        form.setValue('link', links?.find((link: any) => link.id.toString() == value)?.link);
                                                }}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Select')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {links?.map((link: any) => (
                                                        <SelectItem value={link?.id.toString()}>
                                                            <span>
                                                                <img
                                                                    src={`/assets/images/links/thumb/${link?.image}`}
                                                                    className="aspect-square h-6 object-contain"
                                                                    alt=""
                                                                />
                                                            </span>
                                                            {link?.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage>{errors.link_source && <div>{errors.link_source}</div>}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </span>
                            <span className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('Link')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('Link')} type="text" {...field} />
                                            </FormControl>
                                            <FormDescription>{t('For external content you can put link here.')}</FormDescription>
                                            <FormMessage>{errors.link && <div>{errors.link}</div>}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </span>
                        </div>

                        {types ? (
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem key={field.value}>
                                            <FormLabel>{t('Type')}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('Select Type')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {types.map((typeObject) => (
                                                        <SelectItem key={typeObject.id + typeObject.type} value={typeObject.type}>
                                                            {typeObject.label}
                                                        </SelectItem>
                                                    ))}
                                                    {/* <SelectItem value="link">Link</SelectItem> */}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>{t('Choose type (Link) for external content and fill Link input.')}</FormDescription>
                                            <FormMessage>{errors.type && <div>{errors.type}</div>}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ) : null}
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
                                            <Input placeholder={t('Order Index')} type="number" {...field} />
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

                    <div className="grid md:grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="parent_id"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col" key={field.value}>
                                        <FormLabel>{t('Parent Page')}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                    >
                                                        {field.value ? parentData?.find((parent) => parent.id == field.value)?.title : t('Select')}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[350px] p-0">
                                                <Command>
                                                    <CommandInput placeholder={t('Search')} />
                                                    <CommandList>
                                                        <CommandEmpty>{t('No data')}</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value=""
                                                                onSelect={() => {
                                                                    form.setValue('parent_id', '');
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn('mr-2 h-4 w-4', '' == field.value ? 'opacity-100' : 'opacity-0')}
                                                                />
                                                                Select Parent
                                                            </CommandItem>
                                                            {parentData?.map((parent) => (
                                                                <CommandItem
                                                                    value={parent?.order_index + parent.title}
                                                                    key={parent.id}
                                                                    onSelect={() => {
                                                                        form.setValue('parent_id', parent.id.toString());
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            parent.id == field.value ? 'opacity-100' : 'opacity-0',
                                                                        )}
                                                                    />
                                                                    <span className="font-mono"> {parent?.order_index}</span>
                                                                    {/* {parent?.order_index && getDashes(parent?.order_index)}  */}
                                                                    {parent.title}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>{t('Select the parent page for this page.')}</FormDescription>
                                        <FormMessage>{errors.parent_id && <div>{errors.parent_id}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="position_code"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col" key={field.value}>
                                        <FormLabel>{t('Position')}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                    >
                                                        {field.value
                                                            ? pagePositions?.find((position) => position.code === field.value)?.name
                                                            : t('Select')}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder={t('Search')} />
                                                    <CommandList>
                                                        <CommandEmpty>{t('No data')}</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value=""
                                                                onSelect={() => {
                                                                    form.setValue('position_code', '');
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn('mr-2 h-4 w-4', '' == field.value ? 'opacity-100' : 'opacity-0')}
                                                                />
                                                                Select Position
                                                            </CommandItem>
                                                            {pagePositions?.map((position) => (
                                                                <CommandItem
                                                                    value={position.name}
                                                                    key={position.code}
                                                                    onSelect={() => {
                                                                        form.setValue('position_code', position.code);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            position.code === field.value ? 'opacity-100' : 'opacity-0',
                                                                        )}
                                                                    />
                                                                    {position.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>{t('Select the position where this item will show.')}</FormDescription>
                                        <FormMessage>{errors.position_code && <div>{errors.position_code}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
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
                                                    &nbsp; {t('or drag and drop')}
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
                                {editData.images.map((imageObject) => (
                                    <>
                                        <span
                                            key={imageObject.id}
                                            className="group bg-background relative aspect-square h-auto w-full overflow-hidden rounded-md border p-0"
                                        >
                                            <img
                                                src={'/assets/images/pages/thumb/' + imageObject.image}
                                                alt={imageObject.name}
                                                className="h-full w-full object-contain"
                                            />
                                            <span className="absolute top-1 right-1 group-hover:opacity-100 lg:opacity-0">
                                                <DeleteButton deletePath="/admin/pages/images/" id={imageObject.id} />
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
                    {/* Start Long Description */}
                    <div key={'long_description' + editorKey} className="space-y-8">
                        <div>
                            <p className="mb-1 text-sm font-medium">{t('Long Description')}</p>
                            <MyCkeditor5 data={long_description} setData={setLong_description} />
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium">{t('Long Description Khmer')}</p>
                            <MyCkeditor5 data={long_description_kh} setData={setLong_description_kh} />
                        </div>
                    </div>

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
