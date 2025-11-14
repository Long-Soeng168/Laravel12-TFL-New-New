import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Props interface with optional title/subtitle
interface RegisterSuccessProps {
    title?: string;
    subTitle?: string;
    link?: string;
    buttonTitle?: string;
}

const RegisterSuccess: React.FC<RegisterSuccessProps> = ({ title, subTitle, link, buttonTitle }) => {
    const [open, setOpen] = useState(true);
    const { t } = useTranslation();

    // fallback defaults
    const defaultTitle = t('Message!');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent showCloseButton={true} className="max-w-sm space-y-4 rounded-2xl p-6 text-center">
                <div className="mx-auto mt-8 flex items-center justify-center rounded-full bg-green-100 p-4">
                    <CheckCircle className="size-14 text-green-400" />
                </div>

                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-green-600">{title || defaultTitle}</DialogTitle>
                    {subTitle && (
                        <DialogDescription className="flex justify-center text-gray-600">
                            <p className="w-auto max-w-[60ch] text-center text-base">{subTitle}</p>
                        </DialogDescription>
                    )}
                </DialogHeader>

                <DialogFooter>
                    {/* <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose> */}
                    {link && (
                        <Button type="submit">
                            <Link href={link ? link : '#'}>{buttonTitle || 'Submit'}</Link>
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterSuccess;
