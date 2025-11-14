import { MyTooltipButton } from '@/components/my-tooltip-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import Create from '../Create';
import useTranslation from '@/hooks/use-translation';
const EditButton = ({ item }: { item: any }) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog modal={false} open={isOpen}>
            <DialogTrigger asChild>
                <MyTooltipButton variant="ghost" title={t('Edit')} side='bottom' className="text-foreground" size="icon" onClick={() => setIsOpen(true)} >
                    <EditIcon />
                </MyTooltipButton>
            </DialogTrigger>
            {isOpen && <div className="fixed inset-0 z-40 bg-black/80" />}
            <DialogContent>
                <Button className={`absolute top-4 right-4 z-50`} variant={`outline`} size={`icon`} onClick={() => setIsOpen(false)}>
                    <XIcon />
                </Button>
                <DialogHeader>
                    <DialogTitle>{t('Edit')}</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                    <Create editData={item} setIsOpen={setIsOpen}/>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default EditButton;
