import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScanEyeIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import Create from '../Create';

import useTranslation from '@/hooks/use-translation';
const ViewButton = ({ item }: { item: any }) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog modal={false} open={isOpen}>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="text-foreground" size="icon" onClick={() => setIsOpen(true)}>
                                <ScanEyeIcon />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>{t('View')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {isOpen && <div className="fixed inset-0 z-40 bg-black/80" />}
            <DialogContent>
                <Button className={`absolute top-4 right-4 z-50`} variant={`outline`} size={`icon`} onClick={() => setIsOpen(false)}>
                    <XIcon />
                </Button>
                <DialogHeader>
                    <DialogTitle>{t('Show')}</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                    <Create editData={item} readOnly={true} setIsOpen={setIsOpen} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ViewButton;
