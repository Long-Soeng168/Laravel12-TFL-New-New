import { Button } from '@/components/ui/button';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import axios from 'axios';
import { CloudUpload, Loader, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    address: z.string().min(1).max(255),
    phone: z.string().max(255).optional(),
    opening_hours: z.string().max(255).optional(),
    email: z.string().optional(),
    copyright: z.string().optional(),
    image: z.string().optional(),
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
            address: item.address || '',
            phone: item.phone || '',
            opening_hours: item.opening_hours || '',
            email: item.email || '',
            copyright: item.copyright || '',
        },
    });

    const [parentTableData, setparentTableData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the Laravel API route
        axios
            .get('/admin/website_info')
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
            post('/admin/website_info/' + item.id + '/update', {
                preserveScroll: true,
                onSuccess: () => {
                    setFiles(null);
                },
                onError: (e) => {
                    console.log(e);
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
        destroy('/admin/website_info/images/' + id);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-10">
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Title')}</FormLabel>
                                    <FormControl>
                                        <Input autoFocus placeholder="New address" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.address && <div>{errors.address}</div>}</FormMessage>
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
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone Number" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.phone && <div>{errors.phone}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Email" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.email && <div>{errors.email}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="opening_hours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opening Hours</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Time Office Opening" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.opening_hours && <div>{errors.opening_hours}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-12">
                        <FormField
                            control={form.control}
                            name="copyright"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Copy Right</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Copy Right" type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>Your Copy Right</FormDescription>
                                    <FormMessage>{errors.copyright && <div>{errors.copyright}</div>}</FormMessage>
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
                                            // <FileUploaderItem key={i} index={i}>
                                            //     <Paperclip className="h-4 w-4 stroke-current" />
                                            //     <span>{file.name}</span>
                                            // </FileUploaderItem>
                                        ))}
                                    </FileUploaderContent>
                                </FileUploader>
                            </FormControl>
                            <FormMessage>{errors.image && <div>{errors.image}</div>}</FormMessage>
                            {item.image && (
                                <div className="mt-4 p-1">
                                    <FormDescription className="mb-2">{t('Uploaded Image')}</FormDescription>
                                    <div className="grid w-full grid-cols-1 gap-2 rounded-md lg:grid-cols-3">
                                        <span className="group bg-background relative aspect-square h-auto w-full overflow-hidden rounded-md border p-0">
                                            <img
                                                src={`/assets/images/website_info/thumb/${item.image}`}
                                                alt="Uploaded Image"
                                                className="h-full w-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                className="invisible absolute top-1 right-1 cursor-pointer group-hover:visible"
                                                disabled={processing}
                                                onClick={() => handleDestroyImage(item.id)} // or item.image ID if it's stored that way
                                            >
                                                <span className="sr-only">remove item</span>
                                                <Trash2Icon
                                                    className={`group-hover:bg-destructive/80 size-6 rounded-sm stroke-white p-0.5 duration-200 ease-in-out group-hover:stroke-white ${processing && 'cursor-not-allowed'}`}
                                                />
                                            </button>
                                        </span>
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
