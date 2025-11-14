import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { LayoutGridIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const CategorySelect = ({ finalCategorySelect, setFinalCategorySelect }: { finalCategorySelect: any; setFinalCategorySelect: any }) => {
    const { itemCategories, editData } = usePage<any>().props;
    const { currentLocale } = useTranslation(); // Replace with actual i18n logic

    const [openDialog, setOpenDialog] = useState(false);

    const handleCategoryClick = (category: any) => {
        setFinalCategorySelect(category);
        setOpenDialog(false);
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
                    <Button variant="outline" className="h-[37px] w-full">
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
                        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
                            {itemCategories?.map(renderCategoryCard)}
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CategorySelect;
