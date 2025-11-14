import { ScrollArea } from '@/components/ui/scroll-area';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { Grip } from 'lucide-react';

export function ShopCategoriesNav() {
    const { t, currentLocale } = useTranslation();
    const { item_categories, url } = usePage().props;

    return (
        <ScrollArea className="m-0.5 mr-0 h-[500px] w-[210px] space-y-2 pr-4">
            <Link
                prefetch
                href={`/shops`}
                className="hover:border-primary bg-background border-background flex cursor-pointer items-center justify-start gap-2 rounded border px-2 py-2 transition-all duration-300 hover:border-solid"
            >
                <div className="text-primary size-6 object-contain">
                    <Grip />
                </div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">{t('All Shop Categories')}</p>
            </Link>
            {item_categories.map((item) => (
                <Link
                    prefetch
                    href={`/shops?category_code=${item?.code}`}
                    key={item?.id}
                    className="hover:border-primary bg-background border-background flex cursor-pointer items-center justify-start gap-2 rounded border px-2 py-2 transition-all duration-300 hover:border-solid"
                >
                    {item?.image && (
                        <img
                            src={`/assets/images/item_categories/thumb/${item?.image}`}
                            alt={`Category ${item?.name}`}
                            className="size-6 object-contain"
                        />
                    )}
                    <p className="text-xs font-semibold text-gray-600 sm:text-sm md:text-base dark:text-white">
                        {currentLocale === 'kh' ? item?.name_kh : item?.name}
                    </p>
                </Link>
            ))}
        </ScrollArea>
    );
}
