import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { Ban } from 'lucide-react';
import { useState } from 'react';
import ContactUsButton from '../../components/contact-us-button';

// Props interface with optional title/subtitle
interface UserSuspendedProps {
    title?: string;
    subTitle?: string;
}

const UserSuspended: React.FC<UserSuspendedProps> = ({ title, subTitle }) => {
    const [open, setOpen] = useState(true);
    const { t } = useTranslation();

    // fallback defaults
    const defaultTitle = t('User Suspended!');
    const defaultSubTitle = t('Your account has been temporarily suspended. Please contact our support team to resolve this issue.');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-sm space-y-4 rounded-2xl p-6 text-center">
                <div className="mx-auto flex items-center justify-center rounded-full bg-red-100 p-4">
                    <Ban className="size-14 text-red-400" />
                </div>

                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-red-600">{title || defaultTitle}</DialogTitle>
                    <DialogDescription className="flex justify-center text-gray-600">
                        <p className="w-auto max-w-[60ch] text-center text-base">{subTitle || defaultSubTitle}</p>
                    </DialogDescription>
                </DialogHeader>

                <span>
                    <ContactUsButton />
                </span>
            </DialogContent>
        </Dialog>
    );
};

export default UserSuspended;
