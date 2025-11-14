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
import { Check, ChevronsUpDown, CloudUpload, Loader, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    title: z.string().min(1).max(255),
    title_kh: z.string().max(255).optional(),
    code: z.string().min(1).max(255),
    order_index: z.string().max(255).optional(),
    parent_code: z.string().optional(),
    status: z.string().optional(),
    images: z.string().optional(),
});

export default function Edit({ item }: { item: any }) {
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
            title: item.title || '',
            title_kh: item.title_kh || '',
            code: item.code || '',
            order_index: item.order_index?.toString() || '',
            parent_code: item.parent_code || '',
            status: item.status || 'active',
        },
    });

    const [parentTableData, setparentTableData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the Laravel API route
        axios
            .get('/admin/all_projects')
            .then((response) => {
                setparentTableData(response.data); // Set the data to state
            })
            .catch((error) => {
                setError(error); // Handle errors if any
            });
    }, []);

    const { post, delete: destroy, progress, processing, transform, errors } = inertiaUseForm();

    function onSubmit(values: z.infer<typeof formSchema>) {
        // toast(
        //     <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
        //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        //     </pre>
        //   );
        try {
            transform(() => ({
                ...values,
                images: files || null,
            }));
            post('/admin/projects/' + item.id + '/update', {
                preserveScroll: true,
                onSuccess: () => {
                    setFiles(null);
                },
                onError: (e) => {
                    toast.error('Error', {
                        description: 'Failed to create.' + JSON.stringify(e, null, 2),
                    });
                },
            });
        } catch (error) {
            console.error('Form submission error', error);
            toast.error('Error', {
                description: 'Something went wrong!',
            });
        }
    }

    const handleDestroyImage = (id: number) => {
        destroy('/admin/projects/images/' + id);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-10">
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Title')}</FormLabel>
                                    <FormControl>
                                        <Input autoFocus placeholder="New Title" type="text" {...field} />
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
                                        <Input placeholder="ចំណងជើងថ្មី" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.title_kh && <div>{errors.title_kh}</div>}</FormMessage>
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
                                        <Input placeholder="ex: P0001" type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>Your Project Uniqe Code</FormDescription>
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
                                        <Input placeholder="ex: 1" type="number" {...field} />
                                    </FormControl>
                                    <FormDescription>{t('Lower number is priority')}</FormDescription>
                                    <FormMessage>{errors.order_index && <div>{errors.order_index}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="parent_code"
                            render={({ field }) => (
                                <FormItem className="flex flex-col" key={field.value}>
                                    <FormLabel>{t('Parent')}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                >
                                                    {field.value
                                                        ? parentTableData.find((item) => item.code === field.value)?.title
                                                        : 'Select category'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search category..." />
                                                <CommandList>
                                                    <CommandEmpty>{t('No data')}</CommandEmpty>
                                                    <CommandGroup>
                                                        {parentTableData
                                                            .filter((parent_item) => parent_item.id !== item.id) // Skip current item
                                                            .map((parent_item) => (
                                                                <CommandItem
                                                                    value={parent_item.title}
                                                                    key={parent_item.code}
                                                                    onSelect={() => {
                                                                        form.setValue('parent_code', parent_item.code);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            parent_item.code === field.value ? 'opacity-100' : 'opacity-0',
                                                                        )}
                                                                    />
                                                                    {parent_item.title}
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>Select the main category this item belongs to.</FormDescription>
                                    <FormMessage>{errors.parent_code && <div>{errors.parent_code}</div>}</FormMessage>
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
                                            <SelectItem value="pending">Pending</SelectItem>
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
                                    <FileUploaderContent className="grid w-full grid-cols-3 gap-2 rounded-md lg:grid-cols-5">
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

                            {/* Initial Image */}
                            {item.images?.length > 0 && (
                                <div className="mt-4 p-1">
                                    <FormDescription className="mb-2">{t('Uploaded Images')}</FormDescription>
                                    <div className="grid w-full grid-cols-3 gap-2 rounded-md lg:grid-cols-5">
                                        {item.images.map((imageObject) => (
                                            <span
                                                key={imageObject.id}
                                                className="group bg-background relative aspect-square h-auto w-full overflow-hidden rounded-md border p-0"
                                            >
                                                <img
                                                    src={'/assets/images/projects/thumb/' + imageObject.image}
                                                    alt={imageObject.name}
                                                    className="h-full w-full object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    className="invisible absolute top-1 right-1 cursor-pointer group-hover:visible"
                                                    disabled={processing}
                                                    onClick={() => handleDestroyImage(imageObject.id)}
                                                >
                                                    <span className="sr-only">remove item</span>
                                                    <Trash2Icon
                                                        className={`group-hover:bg-destructive/80 size-6 rounded-sm stroke-white p-0.5 duration-200 ease-in-out group-hover:stroke-white ${processing && 'cursor-not-allowed'}`}
                                                    />
                                                </button>
                                            </span>

                                            // <FileUploaderItem key={i} index={i}>
                                            //     <Paperclip className="h-4 w-4 stroke-current" />
                                            //     <span>{file.name}</span>
                                            // </FileUploaderItem>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    )}
                />
                {progress && <ProgressWithValue value={progress.percentage} position="start" />}
                <Button disabled={processing} type="submit">
                    {processing && (
                        <span className="size-6 animate-spin">
                            <Loader />
                        </span>
                    )}
                   {processing ? t('Submitting') : t('Submit')}
                </Button>
            </form>
        </Form>
    );
}
