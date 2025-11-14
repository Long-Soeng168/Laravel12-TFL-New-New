import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Check, ChevronsUpDown, FilterIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    parent_code: z.string().optional(),
    status: z.string().optional(),
    sort_by: z.string().optional(),
});


import useTranslation from '@/hooks/use-translation';
export default function MyFilter() {
    const { t } = useTranslation();
    const status_items = [
        {
            label: 'All',
            value: '',
        },
        {
            label: 'Active',
            value: 'active',
        },
        {
            label: 'Inactive',
            value: 'inactive',
        },
    ] as const;

    const initialQueryParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: initialQueryParams.get("status") || "", // Ensure it's a string
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const queryParams = new URLSearchParams(window.location.search);
            if (values.status) {
                queryParams.set('status', values.status);
            } else {
                queryParams.delete('status');
            }
            queryParams.set('page', '1');
            const queryParamsString = queryParams?.toString();
            router.get(currentPath + '?' + queryParamsString);
        } catch (error) {
            console.error('Form submission error', error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormLabel className="flex items-center gap-2">
                    <FilterIcon /> {t('Filter')}
                </FormLabel>
                <div className="grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex flex-col" key={field.value}>
                                    <FormLabel>{t('Status')}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                >
                                                    {field.value
                                                        ? status_items.find((status) => status.value === field.value)?.label
                                                        : 'Select status'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search status..." />
                                                <CommandList>
                                                    <CommandEmpty>No status found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {status_items.map((status) => (
                                                            <CommandItem
                                                                value={status.label}
                                                                key={status.value}
                                                                onSelect={() => {
                                                                    form.setValue('status', status.value);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        status.value === field.value ? 'opacity-100' : 'opacity-0',
                                                                    )}
                                                                />
                                                                {status.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                </div>
                <Button type="submit">{t('Submit')}</Button>
            </form>
        </Form>
    );
}
