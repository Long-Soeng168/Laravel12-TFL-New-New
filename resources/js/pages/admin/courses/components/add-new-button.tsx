import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, XIcon } from 'lucide-react';
import { useState } from 'react';
import Create from '../Create';
import MyAddNewButton from '@/components/my-add-new-button';
import useTranslation from '@/hooks/use-translation';

const AddNewButton = () => {
    const [isOpen, setIsOpen] = useState(false);
     const { t } = useTranslation();
    return (
        <Dialog modal={false} open={isOpen}>
            <DialogTrigger asChild>
                <MyAddNewButton onClick={() => setIsOpen(true)} />
            </DialogTrigger>
            {isOpen && <div className="fixed inset-0 z-40 bg-black/80" />}
            {/* Custom dark background */}
            <DialogContent className="z-50">
                <Button className={`absolute top-4 right-4 z-50`} variant={`outline`} size={`icon`} onClick={() => setIsOpen(false)}>
                    <XIcon />
                </Button>

                <DialogHeader>
                    <DialogTitle>{t('Create')}</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                    <Create setIsOpen={setIsOpen}/>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewButton;
