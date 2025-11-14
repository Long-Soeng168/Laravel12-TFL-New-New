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
import { Check, ChevronsUpDown, CloudUpload, Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    title: z.string().min(1).max(255),
    title_kh: z.string().max(255).optional(),
    short_description: z.string().max(500).optional(),
    short_description_kh: z.string().max(500).optional(),
    status: z.string().optional(),
    is_free: z.boolean().optional(),
    playlist_code: z.string().optional(),
    order_index: z.string().optional(),
    image: z.instanceof(File).optional().nullable(),
    video_file: z.instanceof(File).optional().nullable(),
});

export default function Create() {
    // ===== Start Our Code =====
    const { t } = useTranslation();
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
    const dropZoneConfigVideoFile = {
        maxFiles: 100,
        maxSize: 1024 * 1024 * 300, // 300MB
        multiple: false,
        accept: {
            'video/mp4': ['.mp4'],
            // 'video/x-msvideo': ['.avi'],
            // 'video/quicktime': ['.mov'],
            // 'video/x-matroska': ['.mkv'],
            // 'video/webm': ['.webm'],
            // 'video/3gpp': ['.3gp'],
        },
    };
    const { post, progress, processing, transform, errors } = inertiaUseForm();
    const { playlists, types, editData, links, readOnly } = usePage().props;

    const [files, setFiles] = useState<File[] | null>(null);
    const [videoFiles, setVideoFiles] = useState<File[] | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: editData?.title || '',
            title_kh: editData?.title_kh || '',
            short_description: editData?.short_description || '',
            short_description_kh: editData?.short_description_kh || '',
            status: editData?.status || 'active',
            is_free: editData?.is_free != null ? Boolean(editData.is_free) : false,
            playlist_code: editData?.playlist_code?.toString() || '',
            order_index: editData?.order_index?.toString() || '',
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
                image: files ? files[0] : null,
                video_file: videoFiles ? videoFiles[0] : null,
            }));

            if (editData?.id) {
                post(`/admin/videos/${editData?.id}/update`, {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        setFiles(null);
                        setVideoFiles(null);
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
                post('/admin/videos', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        form.reset();
                        setFiles(null);
                        setVideoFiles(null);
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
            title: t('Videos'),
            href: '/admin/videos',
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

                    <FormField
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
                    />

                    <div className="grid md:grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="playlist_code"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col" key={field.value}>
                                        <FormLabel>{t('Playlist')}</FormLabel>
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
                                                                  const playlist = playlists?.find((playlist) => playlist.code === field.value);
                                                                  return playlist ? `${playlist.name} (${playlist.name_kh})` : '';
                                                              })()
                                                            : t('Select playlist')}

                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search playlist..." />
                                                    <CommandList>
                                                        <CommandEmpty>{t('No data')}</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value=""
                                                                onSelect={() => {
                                                                    form.setValue('playlist_code', '');
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn('mr-2 h-4 w-4', '' == field.value ? 'opacity-100' : 'opacity-0')}
                                                                />
                                                                {t('Select playlist')}
                                                            </CommandItem>
                                                            {playlists?.map((playlist) => (
                                                                <CommandItem
                                                                    value={playlist.name}
                                                                    key={playlist.code}
                                                                    onSelect={() => {
                                                                        form.setValue('playlist_code', playlist.code);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            playlist.code === field.value ? 'opacity-100' : 'opacity-0',
                                                                        )}
                                                                    />
                                                                    {playlist.name} {playlist.name_kh && `(${playlist.name_kh})`}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        {/* <FormDescription>{t('Select the playlist where this post will show.')}</FormDescription> */}
                                        <FormMessage>{errors.playlist_code && <div>{errors.playlist_code}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-3">
                            <FormField
                                control={form.control}
                                name="order_index"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Order Index')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('Order Index')} type="number" {...field} />
                                        </FormControl>
                                        <FormDescription>{t('Video Sequence Order')}</FormDescription>
                                        <FormMessage>{errors.order_index && <div>{errors.order_index}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-3">
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

                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="is_free"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-y-0">
                                        <FormLabel className="mr-3">{t('Free Access')}</FormLabel>
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                disabled={readOnly}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </FormControl>
                                        {/* <FormDescription>{t('Check if this video is free to access')}</FormDescription> */}
                                        <FormMessage>{errors.is_free && <div>{errors.is_free}</div>}</FormMessage>
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
                                <FormLabel>{t('Select image')}</FormLabel>
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
                            </FormItem>
                        )}
                    />
                    {/* Initial Image */}
                    {editData?.image > 0 && (
                        <div className="mt-4 p-1">
                            <FormDescription className="mb-2">{t('Uploaded Images')}</FormDescription>
                            <div className="grid w-full grid-cols-3 gap-2 rounded-md lg:grid-cols-6">
                                <>
                                    <span
                                        key={editData?.id}
                                        className="group bg-background relative aspect-square h-auto w-full overflow-hidden rounded-md border p-0"
                                    >
                                        <img
                                            src={'/assets/images/videos/thumb/' + editData?.image}
                                            alt={editData?.name}
                                            className="h-full w-full object-contain"
                                        />
                                        <span className="absolute top-1 right-1 group-hover:opacity-100 lg:opacity-0">
                                            <DeleteButton deletePath="/admin/videos/images/" id={editData.id} />
                                        </span>
                                    </span>
                                </>
                            </div>
                        </div>
                    )}
                    {/* Start Long Description */}

                    <FormField
                        control={form.control}
                        name="video_file"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('Select video file')}</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={videoFiles}
                                        onValueChange={setVideoFiles}
                                        dropzoneOptions={dropZoneConfigVideoFile}
                                        className="relative p-1"
                                    >
                                        <FileInput id="fileInput" className="outline-1 outline-slate-500 outline-dashed">
                                            <div className="flex w-full flex-col items-center justify-center p-8">
                                                <CloudUpload className="h-10 w-10 text-gray-500" />
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">{t('Click to upload')}</span>
                                                    &nbsp; or drag and drop
                                                </p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent className="grid w-full grid-cols-3 gap-2 rounded-md lg:grid-cols-4">
                                            {videoFiles?.map((file, i) => (
                                                <FileUploaderItem
                                                    key={i}
                                                    index={i}
                                                    className="bg-background h-full w-full overflow-hidden rounded-md border p-0" // Removed aspect-video, added h-40
                                                    aria-roledescription={`video file ${i + 1} containing ${file.name}`}
                                                >
                                                    <div className="relative h-full w-full">
                                                        <video className="h-full w-full object-cover" preload="metadata">
                                                            <source src={URL.createObjectURL(file)} type={file.type} />
                                                        </video>
                                                        <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 bg-black p-1 text-xs text-white">
                                                            {file.name}
                                                        </div>
                                                    </div>
                                                </FileUploaderItem>
                                                // <FileUploaderItem key={i} index={i}>
                                                //     <Paperclip className="h-4 w-4 stroke-current" />
                                                //     <span>{file.name}</span>
                                                // </FileUploaderItem>
                                            ))}
                                        </FileUploaderContent>
                                    </FileUploader>
                                </FormControl>
                                <FormMessage>{errors.video_file && <div>{errors.video_file}</div>}</FormMessage>
                                {editData?.video_file && (
                                    <div className="mt-4 p-1">
                                        <FormDescription className="mb-2">Uploaded Video.</FormDescription>
                                        <div className="grid w-full grid-cols-2 gap-2 rounded-md lg:grid-cols-3">
                                            <span
                                                className="bg-background h-full w-full overflow-hidden rounded-md border p-0" // Removed aspect-video, added h-40
                                            >
                                                <div className="relative h-full w-full">
                                                    <video
                                                        className="h-full w-full object-cover"
                                                        preload="metadata"
                                                        controls
                                                        controlsList="nodownload"
                                                    >
                                                        <source src={`/assets/files/videos/${editData?.video_file}`} />
                                                    </video>
                                                    {/* <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 bg-black p-1 text-xs text-white">
                                                        {editData?.video_file}
                                                    </div> */}
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />

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
