import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { ChevronDownIcon, ChevronUpIcon, LayoutGrid } from 'lucide-react';
import React, { useState } from 'react';

interface SubCategoryListProps {
    items: any[];
}

const SubCategoryList: React.FC<SubCategoryListProps> = ({ items }) => {
    const { t, currentLocale } = useTranslation();
    const [showAll, setShowAll] = useState(false);

    const visibleItems = showAll ? items : items.slice(0, items?.length > 12 ? 11 : 12);

    return (
        <div className="w-full max-w-[100vw] overflow-x-scroll py-4">
            <div className="grid w-[1246px] grid-cols-6 gap-4 min-[1280px]:px-0">
                {visibleItems.map((item) => (
                    <Link
                        prefetch
                        href={`/products?category_code=${item?.code}`}
                        key={item?.id}
                        className="group bg-background hover:border-primary flex h-14 shrink-0 items-center justify-start gap-2 rounded-xl border py-2 pr-2 pl-1.5 transition-all duration-300 hover:shadow-sm"
                    >
                        {item?.image && (
                            <span className="bg-accent size-11 shrink-0 overflow-visible rounded-md transition-transform duration-300 group-hover:scale-115">
                                <img
                                    src={`/assets/images/item_categories/thumb/${item?.image}`}
                                    alt={`Category ${item?.name}`}
                                    className="size-full rounded-md overflow-visible object-contain p-0.5"
                                />
                            </span>
                        )}
                        <p className="text-muted-foreground group-hover:text-primary w-full text-center text-sm font-medium dark:text-white">
                            {currentLocale === 'kh' ? item?.name_kh : item?.name}
                        </p>
                    </Link>
                ))}

                {items.length > 12 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="group bg-background hover:border-primary flex h-14 shrink-0 items-center justify-start gap-2 rounded-xl border px-4 py-2 transition-all duration-300 hover:shadow-sm"
                    >
                        <div className="text-primary flex size-10 items-center justify-center transition-transform duration-300 group-hover:scale-115">
                            <LayoutGrid />
                        </div>
                        <p className="text-muted-foreground group-hover:text-primary flex items-center gap-2 text-center text-sm font-medium dark:text-white">
                            {showAll ? t('See Less') : t('See More')}
                            {showAll ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </p>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SubCategoryList;
