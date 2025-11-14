import MyNoData from '@/components/my-no-data';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { AlertCircleIcon, LayoutGridIcon } from 'lucide-react';
import { useState } from 'react';

const SizeSelect = ({
    finalCategorySelect,
    finalSizeSelect,
    setFinalSizeSelect,
    filteredSizes,
}: {
    finalCategorySelect: any;
    setFinalCategorySelect: any;
    finalSizeSelect: any;
    setFinalSizeSelect: any;
    filteredSizes: any;
}) => {
    const { itemSizes } = usePage<any>().props;
    const { currentLocale } = useTranslation();

    const [openDialog, setOpenDialog] = useState(false);

    const handleSizeClick = (Size) => {
        setFinalSizeSelect(Size);
        setOpenDialog(false);
    };

    const renderSizeCard = (item) => (
        <button
            key={item.id}
            type="button"
            onClick={() => handleSizeClick(item)}
            className={`${finalSizeSelect?.code == item?.code && 'border-primary'} group bg-background hover:border-primary flex h-full flex-col items-center justify-center gap-2 rounded-xl border px-2 py-2 transition-all duration-300 hover:shadow-sm`}
        >
            {item.image && (
                <img
                    src={`/assets/images/item_Sizes/thumb/${item.image}`}
                    alt={`Size ${item.name}`}
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
                        {finalSizeSelect ? (
                            <div className="flex items-center gap-2">
                                {finalSizeSelect?.image && (
                                    <img
                                        src={`/assets/images/item_Sizes/thumb/${finalSizeSelect?.image}`}
                                        alt={`Size ${finalSizeSelect?.name}`}
                                        className="size-7 object-contain"
                                    />
                                )}
                                <p className="text-primary text-sm font-bold">
                                    {currentLocale === 'kh' ? finalSizeSelect?.name_kh : finalSizeSelect?.name}
                                </p>
                            </div>
                        ) : (
                            <p className="w-full text-start">Select Size</p>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] p-4 sm:max-w-[825px]">
                    <DialogHeader>
                        <div>
                            {finalCategorySelect?.code ? (
                                <>
                                    Size Selected: <strong>{finalSizeSelect?.name}</strong>
                                </>
                            ) : (
                                <Alert className="text-destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle>Please Select Category First.</AlertTitle>
                                </Alert>
                            )}
                        </div>
                        {filteredSizes?.length > 0 ? (
                            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
                                {filteredSizes.map(renderSizeCard)}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFinalSizeSelect(null);
                                        setOpenDialog(false);
                                    }}
                                    className={`'border-primary'} group bg-background hover:border-primary flex h-full flex-col items-center justify-center gap-2 rounded-xl border px-2 py-2 transition-all duration-300 hover:shadow-sm`}
                                >
                                    <p className="text-primary group-hover:text-primary flex items-center gap-2 text-center text-sm font-medium dark:text-white">
                                        <LayoutGridIcon size={18} /> Other
                                    </p>
                                </button>
                            </div>
                        ) : (
                            <MyNoData />
                        )}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SizeSelect;
