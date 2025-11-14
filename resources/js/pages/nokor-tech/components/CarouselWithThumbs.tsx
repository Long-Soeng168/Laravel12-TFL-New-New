import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import * as React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css'; // Thumbnail plugin styles
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export default function CarouselWithThumbs({ images }: { images: any }) {
    const [open, setOpen] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const slides = images.map((imageObject: any) => ({ src: `/assets/images/items/${imageObject?.image}` }));

    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        if (!api) {
            return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);
    const handleThumbClick = React.useCallback(
        (index: number) => {
            api?.scrollTo(index);
        },
        [api],
    );
    return (
        <div className="mx-auto w-full">
            <Carousel setApi={setApi} className="w-full max-w-full">
                <CarouselContent>
                    {images?.map((item, index) => (
                        <CarouselItem key={index}>
                            <Card className="overflow-hidden p-0">
                                <CardContent className="flex aspect-square items-center justify-center overflow-hidden p-0">
                                    <img
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setOpen(true);
                                        }}
                                        src={`/assets/images/items/${item?.image}`}
                                        className="h-full w-full object-cover"
                                        alt=""
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <Carousel className="mt-4 w-full max-w-full">
                <CarouselContent className="my-1 flex">
                    {images?.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className={cn('basis-1/5 cursor-pointer', current === index + 1 ? 'opacity-100' : 'opacity-50')}
                            onClick={() => handleThumbClick(index)}
                        >
                            <Card className="overflow-hidden p-0">
                                <CardContent className="flex aspect-square items-center justify-center overflow-hidden p-0">
                                    <img src={`/assets/images/items/thumb/${item?.image}`} className="h-full w-full object-contain" alt="" />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {images?.length > 5 && (
                    <>
                        <CarouselPrevious className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 transform" />
                        <CarouselNext className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 transform" />
                    </>
                )}
            </Carousel>

            <Lightbox open={open} close={() => setOpen(false)} slides={slides} index={currentIndex} plugins={[Thumbnails, Zoom]} />
        </div>
    );
}
