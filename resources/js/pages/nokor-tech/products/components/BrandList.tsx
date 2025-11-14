import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDownIcon, ChevronUpIcon, LayoutGrid } from 'lucide-react';
import React, { useState } from 'react';

interface BrandListProps {
    items: any[];
}

const BrandList: React.FC<BrandListProps> = ({ items }) => {
    const { t, currentLocale } = useTranslation();
    const [showAll, setShowAll] = useState(false);

    const { q_category_code, selected_brand } = usePage().props;
    // console.log(q_category_code);

    const visibleItems = showAll ? items : items.slice(0, items?.length > 8 ? 7 : 8);

    return (
        <div className="w-full max-w-[100vw] overflow-x-scroll py-4">
            <div className="grid w-[1246px] grid-cols-8 gap-4 min-[1280px]:px-0">
                {visibleItems.map((item) => (
                    <Link
                        prefetch
                        href={`/products?category_code=${q_category_code}&brand_code=${item?.code}`}
                        key={item?.id}
                        className={`${selected_brand?.code == item?.code && 'border-primary'} group bg-background hover:border-primary flex h-14 shrink-0 items-center justify-start gap-2 rounded-xl border py-2 pr-2 pl-1.5 transition-all duration-300 hover:shadow-sm`}
                    >
                        {item?.image && (
                            <span className="bg-accent size-11 shrink-0 overflow-visible rounded-md transition-transform duration-300 group-hover:scale-115">
                                <img
                                    src={`/assets/images/item_brands/thumb/${item?.image}`}
                                    alt={`Category ${item?.name}`}
                                    className="size-full rounded-md object-contain p-0.5"
                                />
                            </span>
                        )}
                        <p className="text-muted-foreground group-hover:text-primary w-full text-center text-sm font-medium dark:text-white">
                            {currentLocale === 'kh' ? item?.name_kh : item?.name}
                        </p>
                    </Link>
                ))}

                {items.length > 8 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="group bg-background hover:border-primary flex h-14 shrink-0 items-center justify-start gap-1 rounded-xl border px-2 py-2 transition-all duration-300 hover:shadow-sm"
                    >
                        <div className="text-primary flex size-10 items-center justify-center transition-transform duration-300 group-hover:scale-115">
                            <LayoutGrid />
                        </div>
                        <p className="text-muted-foreground group-hover:text-primary flex items-center gap-1 text-center text-sm font-medium text-nowrap dark:text-white">
                            {showAll ? t('See Less') : t('See More')}
                            {showAll ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </p>
                    </button>
                )}
            </div>
        </div>
    );
};

export default BrandList;
