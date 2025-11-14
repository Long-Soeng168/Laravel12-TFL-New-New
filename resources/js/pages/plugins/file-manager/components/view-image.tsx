import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';

export function ViewImage({
    selectedImage,
    open,
    setOpen,
}: {
    selectedImage: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
            <DialogContent className='p-0 border-none'>
                <DialogHeader className="hidden">
                    <DialogTitle className="hidden"></DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                </DialogHeader>

                <div>
                    <Button className={`absolute top-4 right-4 z-50`} variant={`outline`} size={`icon`} onClick={() => setOpen(false)}>
                        <XIcon />
                    </Button>
                    <img
                        className="h-full w-full rounded-lg border-none object-contain"
                        src={`${selectedImage}`}
                        alt=""
                    />
                    {/* <img
                        className="h-full w-auto rounded-lg border-none object-contain"
                        src="https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        alt=""
                    /> */}
                </div>
            </DialogContent>
        </Dialog>
    );
}
