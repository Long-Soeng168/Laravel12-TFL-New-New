import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function MySearchProducts({
    className,
    setSearchOpenDialog,
}: {
    className?: string;
    setSearchOpenDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { t } = useTranslation();
    const page = usePage();

    const [isFocused, setIsFocused] = useState(false);
    const [search, setSearch] = useState('');

    // Extract path + query from Inertia's page.url
    const [currentPath, queryString] = page.url.split('?');
    const searchParams = new URLSearchParams(queryString || '');

    useEffect(() => {
        setSearch(searchParams.get('search') || '');
    }, [page.url]); // Runs whenever URL changes

    const handleSearch = (searchTerm: string) => {
        const params = new URLSearchParams(queryString || '');
        params.set('search', searchTerm);
        params.set('page', '1');

        router.get(`/products?${params.toString()}`, {}, { preserveState: true });

        if (setSearchOpenDialog) {
            setSearchOpenDialog(false);
        }
    };

    return (
        <div className={cn('flex w-full max-w-full items-center space-x-2 rounded-xl border p-1', className, isFocused && 'border-primary')}>
            <Input
                value={search}
                type="search"
                autoComplete="search"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(e.currentTarget.value);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="ml-0.5 min-w-xs rounded-sm border-none shadow-none"
                placeholder={`${t('Search Products')}...`}
            />
            <Button variant="outline" className="text-primary" type="button" onClick={() => handleSearch(search)}>
                <SearchIcon className="[&_svg]:size-2" /> <span className="hidden lg:inline">{t('Search')}</span>
            </Button>
        </div>
    );
}
