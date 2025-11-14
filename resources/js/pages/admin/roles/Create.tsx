import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().min(1).max(255),
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

    const { post, put, progress, processing, transform, errors } = inertiaUseForm();
    const { editData, readOnly, permissions } = usePage().props;

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    useEffect(() => {
        if (editData?.permissions) {
            const existingPermissionIds = editData.permissions.map((p) => p.id);
            setSelectedPermissions(existingPermissionIds);
        }
    }, [editData]);

    const handlePermissionToggle = (id) => {
        setSelectedPermissions((prev) => (prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]));
    };

    const handleGroupSelectAll = (group) => {
        const groupIds = group.map((p) => p.id);
        const allSelected = groupIds.every((id) => selectedPermissions.includes(id));

        setSelectedPermissions((prev) => (allSelected ? prev.filter((id) => !groupIds.includes(id)) : [...new Set([...prev, ...groupIds])]));
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: editData?.name || '',
        },
    });

    useEffect(() => {}, []);

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
                permissions: selectedPermissions,
            }));

            if (editData?.id) {
                put(`/admin/roles/${editData?.id}`, {
                    preserveScroll: true,
                    onSuccess: (page) => {
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
                post('/admin/roles', {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        form.reset();
                        setSelectedPermissions([]);
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
            title: 'Roles',
            href: '/admin/roles',
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
                    <div className="grid md:grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Name')}</FormLabel>
                                        <FormControl>
                                            <Input disabled={readOnly === true} placeholder="Role Name" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage>{errors.name && <div>{errors.name}</div>}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <p className="ext-muted-foreground mt-6 mb-1 text-sm font-medium">Permissions</p>
                    <div className="mb-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(permissions).map(([key, group], index) => (
                            <div key={index} className="hover:ring-2 hover:ring-offset-2 ring-primary transition-all duration-300 border-primary rounded-xl border-[1px] p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="text-foreground text-lg font-semibold capitalize">{key}</h2>
                                    {group.length > 0 && (
                                        <label className="text-foreground cursor-pointer flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                onChange={() => handleGroupSelectAll(group)}
                                                checked={group.every((p) => selectedPermissions.includes(p.id))}
                                            />
                                            <span className="select-none">Select All</span>
                                        </label>
                                    )}
                                </div>

                                {group.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {group.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="text-foreground cursor-pointer flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={permission.id}
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onChange={() => handlePermissionToggle(permission.id)}
                                                />
                                                {permission.name.split(' ').slice(-1)[0]}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No permissions in this group</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Old Style in table row */}
                    {/* <div className="border-border mb-6 rounded-lg border shadow-sm">
                        <table className="bg-background w-full overflow-hidden rounded-xl">
                            <thead className="bg-mute">
                                <tr>
                                    <th className="text-foreground px-6 py-4 text-left text-sm font-semibold">Section</th>
                                    <th className="text-foreground px-6 py-4 text-left text-sm font-semibold">Select All</th>
                                    <th className="text-foreground px-6 py-4 text-left text-sm font-semibold">Available Permissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(permissions).map(([key, group], index) => (
                                    <tr key={index} className="border-t">
                                        <td className="text-foreground px-6 py-5 text-sm font-medium capitalize">{key}</td>
                                        <td className="px-6 py-5">
                                            <label className="text-foreground flex items-center gap-2 text-sm whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                    onChange={() => handleGroupSelectAll(group)}
                                                    checked={group.every((p) => selectedPermissions.includes(p.id))}
                                                />
                                                Select All
                                            </label>
                                        </td>
                                        <td className="px-6 py-5">
                                            {group.length > 0 ? (
                                                <div className="flex flex-wrap gap-4">
                                                    {group.map((permission) => (
                                                        <label
                                                            key={permission.id}
                                                            className="text-foregroundshadow-sm ring-border flex items-center gap-2 rounded bg-gray-50 px-3 py-1 text-sm ring-1 dark:bg-gray-900"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={permission.id}
                                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => handlePermissionToggle(permission.id)}
                                                            />
                                                            {permission.name}
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">No permissions in this group</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> */}

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
