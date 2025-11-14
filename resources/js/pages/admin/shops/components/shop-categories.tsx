import { ChevronsUpDown, LayoutGridIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';

const frameworks = [
    {
        value: 'next.js',
        label: 'Next.js',
    },
    {
        value: 'sveltekit',
        label: 'SvelteKit',
    },
    {
        value: 'nuxt.js',
        label: 'Nuxt.js',
    },
    {
        value: 'remix',
        label: 'Remix',
    },
    {
        value: 'astro',
        label: 'Astro',
    },
];

export default function ComboboxDemo() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    const { t, currentLocale } = useTranslation();
    const { item_categories } = usePage().props;

    const page = usePage();
    const [selectedCategoryCode, setSelectedCategoryCode] = React.useState('');

    const [currentPath, queryString] = page?.url?.split('?');
    const searchParams = new URLSearchParams(queryString || '');

    React.useEffect(() => {
        setSelectedCategoryCode(searchParams.get('category_code') || '');
    }, [page.url]); // Runs whenever URL changes

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {value ? item_categories.find((item) => item.code == selectedCategoryCode)?.name : t('Select Category') + '...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={t('Search Category') + '...'} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No data found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value={''} // Store code, not display name
                                onSelect={() => {
                                    setSelectedCategoryCode('');
                                    setValue('');
                                    setOpen(false);
                                    router.get(`/shops?category_code=${''}`, {}, { preserveState: true });
                                }}
                                className={cn('' == selectedCategoryCode && 'bg-accent underline', 'my-1 flex items-center gap-2')}
                            >
                                <span className="flex size-6 items-center justify-center">
                                    <LayoutGridIcon size={28} className="stroke-primary" />
                                </span>
                                <p className="text-primary text-xs font-semibold sm:text-sm">{t('All Shop Categories')}</p>
                            </CommandItem>
                            {item_categories?.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.code} // Store code, not display name
                                    onSelect={(code) => {
                                        setSelectedCategoryCode(code);
                                        setValue(code);
                                        setOpen(false);
                                        router.get(`/shops?category_code=${code}`, {}, { preserveState: true });
                                    }}
                                    className={cn(item.code == selectedCategoryCode && 'bg-accent underline', 'my-1 flex items-center gap-2')}
                                >
                                    {item?.image && (
                                        <img
                                            src={`/assets/images/item_categories/thumb/${item?.image}`}
                                            alt={`Category ${item?.name}`}
                                            className="size-6 object-contain"
                                        />
                                    )}
                                    <p className="text-xs font-semibold text-gray-600 sm:text-sm dark:text-white">
                                        {currentLocale === 'kh' ? item?.name_kh : item?.name}
                                    </p>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
