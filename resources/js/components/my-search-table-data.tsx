import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import debounce from 'debounce';
import { SearchIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

export function MySearchTableData({ className, placholder = 'Search' }: { className?: string; placholder?: string }) {
    const { t } = useTranslation();

    const initialQueryParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(initialQueryParams.get('search') || '');
    const currentPath = window.location.pathname; // Get dynamic path

    const handleSearch = useCallback(
        debounce((searchTerm) => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('search', searchTerm);
            queryParams.set('page', '1');

            router.get(currentPath + '?' + queryParams?.toString(), {}, { preserveState: true, preserveScroll: true });
        }, 500),
        [currentPath], // Dependency ensures it updates if the path changes
    );

    return (
        <div className={cn('flex w-full max-w-xl items-center space-x-2 rounded-xl border p-1', className)}>
            <Input
                defaultValue={search}
                type="search"
                autoComplete="search"
                onChange={(e) => {
                    setSearch(e.target.value);
                    handleSearch(e.target.value);
                }}
                className="ml-0.5 min-w-xs rounded-sm border-none shadow-none"
                placeholder={`${t(placholder)}...`}
            />
            <Button variant="outline" type="submit" onClick={() => handleSearch(search)}>
                <SearchIcon className="[&_svg]:size-2" /> <span className="hidden lg:inline">{t('Search')}</span>
            </Button>
        </div>
    );
}
