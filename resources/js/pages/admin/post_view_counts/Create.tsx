import DeleteButton from '@/components/delete-button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown, CloudUpload, Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    title: z.string().min(1).max(255),
    title_kh: z.string().max(255).optional(),
    short_description: z.string().max(500).optional(),
    short_description_kh: z.string().max(500).optional(),
    link: z.string().max(255).optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    parent_id: z.string().optional(),
    source: z.string().optional(),
    category_code: z.string().optional(),
    post_date: z.coerce.date(),
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
    const { postCategories, editData, links, readOnly } = usePage().props;

    const [files, setFiles] = useState<File[] | null>(null);
    const [long_description, setLong_description] = useState(editData?.long_description || '');
    const [long_description_kh, setLong_description_kh] = useState(editData?.long_description_kh || '');
    const [editorKey, setEditorKey] = useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: editData?.title || '',
            title_kh: editData?.title_kh || '',
            short_description: editData?.short_description || '',
            short_description_kh: editData?.short_description_kh || '',
            link: editData?.link || '',
            type: editData?.type || 'content',
            source: editData?.source?.toString() || '',
            status: editData?.status || 'active',
            category_code: editData?.category_code?.toString() || '',
            post_date: editData?.id ? new Date(editData?.post_date) : new Date(),
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
                long_description_kh: long_description_kh,
                images: files || null,
            }));

            if (editData?.id) {
                post(`/admin/posts/${editData?.id}/update`, {
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
                post('/admin/posts', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        form.reset();
                        setLong_description('');
                        setLong_description_kh('');
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
            title: 'Posts',
            href: '/admin/posts',
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
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="post_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t('Post Date')}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-[280px] pl-3 text-left font-normal',
                                                            !field.value && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    fromYear={1960}
                                                    toYear={2030}
                                                    captionLayout="dropdown-buttons"
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage>{errors.post_date && <div>{errors.post_date}</div>}</FormMessage>
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
                                             <Input placeholder={t("Title")} type="text" {...field} />
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
                                           <Input placeholder={t("Title Khmer")} type="text" {...field} />
                                        </FormControl>
                                        <FormMessage>{errors.title_kh && <div>{errors.title_kh}</div>}</FormMessage>
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
                                                        <SelectValue placeholder={t("Select")} />
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
                                                <Input placeholder={t("Link")} type="text" {...field} />
                                            </FormControl>
                                           
                                            <FormMessage>{errors.link && <div>{errors.link}</div>}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </span>
                        </div>

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
                                                    <SelectValue placeholder={t("Select Type")} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="content">Content</SelectItem>
                                                <SelectItem value="link">Link</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>{t('Choose type (Link) for external content and fill Link input.')}</FormDescription>
                                        <FormMessage>{errors.type && <div>{errors.type}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="category_code"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col" key={field.value}>
                                        <FormLabel>{t('Category')}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                    >
                                                         {field.value
                                                            ? postCategories?.find((category) => category.code === field.value)?.name
                                                            : t('Select category')}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search category..." />
                                                    <CommandList>
                                                        <CommandEmpty>{t('No data')}</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value=""
                                                                onSelect={() => {
                                                                    form.setValue('category_code', '');
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn('mr-2 h-4 w-4', '' == field.value ? 'opacity-100' : 'opacity-0')}
                                                                />
                                                                {t('Select category')}
                                                            </CommandItem>
                                                            {postCategories?.map((category) => (
                                                                <CommandItem
                                                                    value={category.name}
                                                                    key={category.code}
                                                                    onSelect={() => {
                                                                        form.setValue('category_code', category.code);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            category.code === field.value ? 'opacity-100' : 'opacity-0',
                                                                        )}
                                                                    />
                                                                    {category.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>{t('Select the category where this post will show.')}</FormDescription>
                                        <FormMessage>{errors.category_code && <div>{errors.category_code}</div>}</FormMessage>
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
                                                src={'/assets/images/posts/thumb/' + imageObject.image}
                                                alt={imageObject.name}
                                                className="h-full w-full object-contain"
                                            />
                                            <span className="absolute top-1 right-1 group-hover:opacity-100 lg:opacity-0">
                                                <DeleteButton deletePath="/admin/posts/images/" id={imageObject.id} />
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
                    <div key={editorKey} className="space-y-8">
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
