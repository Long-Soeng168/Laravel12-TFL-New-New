import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import ContactUsButton from '../../components/contact-us-button';

// Props interface with optional title/subtitle
interface ShopPendingProps {
    title?: string;
    subTitle?: string;
}

const ShopPending: React.FC<ShopPendingProps> = ({ title, subTitle }) => {
    const [open, setOpen] = useState(true);
    const { t } = useTranslation();

    // fallback defaults
    const defaultTitle = t('Shop Pending Approval');
    const defaultSubTitle = t('Your shop is currently under review. We’ll notify you once it has been approved.');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent showCloseButton className="max-w-sm space-y-4 rounded-2xl p-6 text-center">
                <div className="mx-auto flex items-center justify-center rounded-full bg-yellow-100 p-4">
                    <Clock className="size-14 text-yellow-500" />
                </div>

                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-yellow-600">{title || defaultTitle}</DialogTitle>
                    <DialogDescription className="flex justify-center text-gray-600">
                        <p className="w-auto max-w-[60ch] text-center text-base">{subTitle || defaultSubTitle}</p>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className='justify-center flex w-full md:justify-center'>
                    <ContactUsButton />
                    {/* <DialogClose asChild>
                        <Button variant="outline" className='border border-foreground'>Close</Button>
                    </DialogClose> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ShopPending;
