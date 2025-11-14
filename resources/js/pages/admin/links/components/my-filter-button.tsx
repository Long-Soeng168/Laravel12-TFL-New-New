import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterIcon } from 'lucide-react';
import { useState } from 'react';
import MyFilter from './my-filter';

import useTranslation from '@/hooks/use-translation';
export function MyFilterButton() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const queryParams = new URLSearchParams(window.location.search);

    return (
        <Dialog modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <span className="rounded-xl border p-1">
                                <Button type="submit" variant="outline" size="icon" className="relative p-5">
                                    <FilterIcon />
                                    {queryParams?.get('status') && (
                                        <div className="absolute -top-1 -right-1">
                                            <span className="relative flex size-3">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                                            </span>
                                        </div>
                                    )}
                                </Button>
                            </span>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>{t('Filter')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {isOpen && <div className="fixed inset-0 z-40 bg-black/80" />}
            {/* Custom dark background */}
            <DialogContent className="z-50">
                <DialogHeader>
                    <DialogTitle className="hidden"></DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                    <MyFilter />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
