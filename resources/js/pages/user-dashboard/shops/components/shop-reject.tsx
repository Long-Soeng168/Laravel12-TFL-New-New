import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { XCircle } from 'lucide-react';
import { useState } from 'react';
import ContactUsButton from '../../components/contact-us-button';

// Props interface with optional title/subtitle
interface ShopRejectProps {
    title?: string;
    subTitle?: string;
}

const ShopReject: React.FC<ShopRejectProps> = ({ title, subTitle }) => {
    const [open, setOpen] = useState(true);
    const { t } = useTranslation();

    // fallback defaults
    const defaultTitle = t('Shop Registration Rejected');
    const defaultSubTitle = t('Unfortunately, your shop registration was not approved. Please contact our support team for more details.');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-sm space-y-4 rounded-2xl p-6 text-center">
                <div className="mx-auto flex items-center justify-center rounded-full bg-red-100 p-4">
                    <XCircle className="size-14 text-red-500" />
                </div>

                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-red-600">
                        {title || defaultTitle}
                    </DialogTitle>
                    <DialogDescription className="flex justify-center text-gray-600">
                        <p className="w-auto max-w-[60ch] text-center text-base">
                            {subTitle || defaultSubTitle}
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <span>
                    <ContactUsButton />
                </span>
            </DialogContent>
        </Dialog>
    );
};

export default ShopReject;
