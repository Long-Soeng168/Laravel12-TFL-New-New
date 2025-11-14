import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PlayCircleIcon } from 'lucide-react';

export default function VideoDialog({ videoSrc }: { videoSrc: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <PlayCircleIcon />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl overflow-hidden p-0">
                <div className="aspect-video w-full">
                    <video className="h-full w-full object-cover" preload="metadata" controls controlsList="nodownload">
                        <source src={videoSrc} />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </DialogContent>
        </Dialog>
    );
}
