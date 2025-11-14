import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useTranslation from '@/hooks/use-translation';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { MySearchProducts } from './my-search-products';

const MySearchProductsDialog = () => {
    const [searchOpenDialog, setSearchOpenDialog] = useState(false);
    const { t } = useTranslation();
    return (
        <div>
            <Sheet open={searchOpenDialog} onOpenChange={setSearchOpenDialog}>
                <SheetTrigger asChild>
                    <button
                        className={`dark:bg-foreground/30 mr-1 ml-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shadow-md transition-all duration-300 hover:scale-115`}
                    >
                        <SearchIcon className="size-6" />
                    </button>
                </SheetTrigger>
                <SheetContent side="top" className="w-full p-6 shadow-md">
                    <SheetHeader>
                        <SheetTitle>{t('Search Products')}</SheetTitle>
                    </SheetHeader>
                    <MySearchProducts setSearchOpenDialog={setSearchOpenDialog} className="border-primary mx-auto max-w-full" />
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MySearchProductsDialog;
