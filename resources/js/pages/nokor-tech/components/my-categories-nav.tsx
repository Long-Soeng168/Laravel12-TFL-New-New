import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function MyCategoriesNav() {
    const { item_categories } = usePage().props;
    const [openDropdown, setOpenDropdown] = useState(false);
    const { t } = useTranslation();

    return (
        <DropdownMenu open={openDropdown} onOpenChange={() => setOpenDropdown(false)}>
            <DropdownMenuTrigger onMouseEnter={() => setOpenDropdown(true)} className="border-none outline-none">
                <span className="hover:text-primary group relative flex items-center gap-1 rounded p-2">
                    <p className="relative">
                        {t('Shop Categories')}
                        <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full"></span>
                    </p>{' '}
                    <ChevronDown size={18} className="translate-y-[1px]" />
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup onMouseLeave={() => setOpenDropdown(false)} className="space-y-1">
                    {item_categories?.map((category) =>
                        category?.children?.length > 0 ? (
                            <DropdownMenuSub key={category?.id}>
                                <div className="flex">
                                    <Link prefetch href={`/products?category_code=${category?.code}`} className="group flex-1 p-0.5">
                                        <p className="hover:text-primary relative flex w-full gap-1">
                                            {category?.image ? (
                                                <img
                                                    className="mr-1 size-6 object-contain"
                                                    src={`/assets/images/item_categories/thumb/${category?.image}`}
                                                    alt=""
                                                />
                                            ) : (
                                                <span className="mr-1 size-6 object-contain" />
                                            )}
                                            {category?.name}
                                            <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full"></span>
                                        </p>
                                    </Link>
                                    <DropdownMenuSubTrigger className="hover:bg-primary inline-block hover:text-white"></DropdownMenuSubTrigger>
                                </div>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        {category?.children?.map((item) => (
                                            <DropdownMenuItem key={item?.id} asChild>
                                                <Link prefetch href={`/products?category_code=${item?.code}`} className="cursor-pointer p-2">
                                                    {item?.name}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        ) : (
                            <DropdownMenuSub>
                                <div className="flex">
                                    <Link prefetch href={`/products?category_code=${category?.code}`} className="group flex-1 p-0.5">
                                        <p className="hover:text-primary relative flex w-full gap-1">
                                            {category?.image ? (
                                                <img
                                                    className="mr-1 size-6 object-contain"
                                                    src={`/assets/images/item_categories/thumb/${category?.image}`}
                                                    alt=""
                                                />
                                            ) : (
                                                <span className="mr-1 size-6 object-contain" />
                                            )}
                                            {category?.name}
                                            <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full"></span>
                                        </p>
                                    </Link>
                                </div>
                            </DropdownMenuSub>
                        ),
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
