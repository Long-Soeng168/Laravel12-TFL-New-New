import MyDialogCloseButton from '@/components/my-dialog-close-button';
import { MyTooltipButton } from '@/components/my-tooltip-button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScanEyeIcon } from 'lucide-react';
import { useState } from 'react';
import Create from '../Create';

import useTranslation from '@/hooks/use-translation';
const ViewButton = ({ item }: { item: any }) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog modal={false} open={isOpen}>
            <DialogTrigger asChild>
                <MyTooltipButton variant="ghost" title={t('Show')} side="bottom" className="text-foreground" size="icon" onClick={() => setIsOpen(true)}>
                    <ScanEyeIcon />
                </MyTooltipButton>
            </DialogTrigger>

            {isOpen && <div className="fixed inset-0 z-40 bg-black/80" />}
            <DialogContent>
                <MyDialogCloseButton onClick={() => setIsOpen(false)} />

                <DialogHeader>
                    <DialogTitle>{t('Show')}</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                    <Create readOnly={true} editData={item} setIsOpen={setIsOpen} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ViewButton;
