import MyDialogCancelButton from '@/components/my-dialog-cancel-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useTranslation from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import axios from 'axios';
import { CloudUpload, Loader, Paperclip } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().min(6).max(255),
    phone: z.string().max(255).optional(),
    gender: z.string().max(255).optional(),
    password: z.string().max(255).optional(),
    password_confirmation: z.string().max(255).optional(),
    image: z.string().optional(),
    roles: z.array(z.string()).optional(),
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
            email: editData?.email || '',
            phone: editData?.phone || '',
            gender: editData?.gender || '',
            password: '',
            password_confirmation: '',
            image: '',
            roles: editData?.roles?.map((r: any) => r.name) || [],
        },
    });

    const [roles, setRoles] = useState([]);
    const [isGettingRoles, setIsGettingRoles] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsGettingRoles(true);
        getParentsTableData();
        // Fetch data from the Laravel API route
    }, []);

    function getParentsTableData() {
        axios
            .get('/admin/all_roles')
            .then((response) => {
                setIsGettingRoles(false);
                setRoles(response.data);
            })
            .catch((error) => {
                setError(error);
            });
    }

    const { post, data, progress, processing, transform, errors } = inertiaUseForm();

    function onSubmit(values: z.infer<typeof formSchema>) {
        // toast(
        //     <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
        //         <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        //     </pre>,
        // );
        try {
            transform(() => ({
                ...values,
                image: files ? files[0] : null,
            }));
            if (editData?.id) {
                post('/admin/users/' + editData.id + '/update', {
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
                            description: 'Failed to update.' + JSON.stringify(e, null, 2),
                        });
                    },
                });
            } else {
                post('/admin/users', {
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
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Phone Number')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Phone Number')} type="number" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.phone && <div>{errors.phone}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Email')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('Email')} type="email" {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.email && <div>{errors.email}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Gender')}</FormLabel>
                                    <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Gender')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">{t('Male')}</SelectItem>
                                            <SelectItem value="female">{t('Female')}</SelectItem>
                                            <SelectItem value="other">{t('Other')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage>{errors.gender && <div>{errors.gender}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Password')}</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder={t('Password')} {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.password && <div>{errors.password}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Confirm Password')}</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder={t('Confirm Password')} {...field} />
                                    </FormControl>
                                    <FormMessage>{errors.password_confirmation && <div>{errors.password_confirmation}</div>}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                {roles.length > 0 && (
                    <div>
                        <Label className="font-semibold">{t('Roles')}</Label>
                        <div className="mt-2 flex flex-wrap items-center gap-6">
                            {roles.map(({ name }) => {
                                const selectedRoles = form.watch('roles') || [];

                                return (
                                    <div key={name} className="flex items-center gap-1">
                                        <Checkbox
                                            id={name}
                                            checked={selectedRoles.includes(name)}
                                            onCheckedChange={(checked) => {
                                                const updated = checked ? [...selectedRoles, name] : selectedRoles.filter((r) => r !== name);
                                                form.setValue('roles', updated);
                                            }}
                                        />
                                        <label
                                            htmlFor={name}
                                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {name}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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

                            {/* Initial Image */}
                            {editData?.image && (
                                <div className="mt-4 p-1">
                                    <FormDescription className="mb-2">{t('Uploaded Image')}</FormDescription>
                                    <div className="grid w-full grid-cols-3 gap-2 rounded-md lg:grid-cols-5">
                                        <span
                                            key={editData?.image}
                                            className="group bg-background relative aspect-square h-auto w-full overflow-hidden rounded-md border p-0"
                                        >
                                            <img
                                                src={'/assets/images/users/thumb/' + editData?.image}
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
