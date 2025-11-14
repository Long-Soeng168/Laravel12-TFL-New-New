import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { LayoutGridIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CategorySelectBreadcrumb } from './category-select-breadcrumb';

const CategorySelect = ({ finalCategorySelect, setFinalCategorySelect }: { finalCategorySelect: any; setFinalCategorySelect: any }) => {
    const { itemCategories, editData, userShopCategory } = usePage<any>().props;
    const { currentLocale } = useTranslation(); // Replace with actual i18n logic

    const [openDialog, setOpenDialog] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

    useEffect(() => {
        const targetCode = editData?.category?.code || userShopCategory?.code;
        if (!targetCode || finalCategorySelect) return;

        const findCategoryPath = (categories: any, targetCode: any, path: any = []): any => {
            for (const cat of categories) {
                const currentPath = [...path, cat];
                if (cat.code === targetCode) return currentPath;
                if (cat.children?.length) {
                    const found = findCategoryPath(cat.children, targetCode, currentPath);
                    if (found) return found;
                }
            }
            return null;
        };

        const path = findCategoryPath(itemCategories, targetCode);

        if (path) {
            // const last = path[path.length - 1];
            setFinalCategorySelect(null);
            if (path.length >= 1) setSelectedCategory(path[0]);
            if (path.length >= 2) setSelectedSubCategory(path[1]);
        }
    }, [editData, userShopCategory, itemCategories]);

    const getCategoriesToRender = () => {
        if (selectedSubCategory?.children?.length) return selectedSubCategory.children;
        if (selectedCategory?.children?.length) return selectedCategory.children;
        return itemCategories;
    };

    const handleCategoryClick = (category: any) => {
        setFinalCategorySelect(category);
        if (!selectedCategory) {
            setSelectedCategory(category);
        } else if (!selectedSubCategory) {
            setSelectedSubCategory(category);
        } else {
            // You can add a third level or trigger final action here
            console.log('Selected Final Category:', category);
            setOpenDialog(false);
        }
    };

    const renderCategoryCard = (item: any) => (
        <button
            key={item.id}
            type="button"
            onClick={() => handleCategoryClick(item)}
            className={`${finalCategorySelect?.code == item?.code && 'border-primary'} group bg-background hover:border-primary flex h-full flex-col items-center justify-center gap-2 rounded-xl border px-2 py-2 transition-all duration-300 hover:shadow-sm`}
        >
            {item.image && (
                <img
                    src={`/assets/images/item_categories/thumb/${item.image}`}
                    alt={`Category ${item.name}`}
                    className="h-13 w-13 object-contain transition-transform duration-300 group-hover:scale-115"
                />
            )}
            <p className="text-muted-foreground group-hover:text-primary text-center text-sm font-medium dark:text-white">
                {currentLocale === 'kh' ? item.name_kh : item.name}
            </p>
        </button>
    );

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <Button key={finalCategorySelect?.code} variant="outline" className="h-[37px] w-full">
                        {finalCategorySelect ? (
                            <div className="flex items-center gap-2">
                                <>
                                    {finalCategorySelect?.image && (
                                        <img
                                            src={`/assets/images/item_categories/thumb/${finalCategorySelect?.image}`}
                                            alt={`Category ${finalCategorySelect?.name}`}
                                            className="size-7 object-contain transition-transform duration-300 group-hover:scale-115"
                                        />
                                    )}
                                    <p className="text-primary group-hover:text-primary text-center text-sm font-bold">
                                        {currentLocale === 'kh' ? finalCategorySelect?.name_kh : finalCategorySelect?.name}
                                    </p>
                                </>
                            </div>
                        ) : (
                            <p className="w-full text-start">Select Category</p>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] p-4 sm:max-w-[825px]">
                    <DialogHeader>
                        <CategorySelectBreadcrumb
                            selectedCategory={selectedCategory}
                            selectedSubCategory={selectedSubCategory}
                            setSelectedCategory={setSelectedCategory}
                            setSelectedSubCategory={setSelectedSubCategory}
                            setFinalCategorySelect={setFinalCategorySelect}
                        />
                        <Separator />
                        <p>
                            Selected : <strong>{finalCategorySelect?.name}</strong>
                        </p>
                        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
                            {getCategoriesToRender().map(renderCategoryCard)}
                            {selectedCategory && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedSubCategory) {
                                            setFinalCategorySelect(selectedSubCategory);
                                        } else if (selectedCategory) {
                                            setFinalCategorySelect(selectedCategory);
                                        }
                                        setOpenDialog(false);
                                    }}
                                    className={`'border-primary'} group bg-background hover:border-primary flex h-full flex-col items-center justify-center gap-2 rounded-xl border px-2 py-2 transition-all duration-300 hover:shadow-sm`}
                                >
                                    <p className="text-primary group-hover:text-primary flex items-center gap-2 text-center text-sm font-medium dark:text-white">
                                        <LayoutGridIcon size={18} /> Other
                                    </p>
                                </button>
                            )}
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CategorySelect;
