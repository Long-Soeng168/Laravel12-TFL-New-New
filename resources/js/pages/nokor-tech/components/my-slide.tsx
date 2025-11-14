import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

interface SlideItem {
    id: number;
    title: string;
    link?: string | null;
    image: string;
}

interface MySlideProps {
    slides: SlideItem[];
    path?: string;
}

const MySlide: React.FC<MySlideProps> = ({ slides, path = '' }) => {
    const [api, setApi] = React.useState<CarouselApi | null>(null);
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;

        const updateCurrent = () => setCurrent(api.selectedScrollSnap());
        updateCurrent();
        setCount(api.scrollSnapList().length);

        api.on('select', updateCurrent);

        return () => {
            api.off('select', updateCurrent);
        };
    }, [api]);

    return (
        <Carousel plugins={[Autoplay({ delay: 4000 })]} opts={{ align: 'start', loop: true }} setApi={setApi} className="relative">
            <CarouselContent>
                {slides.map((slide) => (
                    <CarouselItem key={slide.id}>
                        <div>
                            {slide.link ? (
                                <a href={slide.link}>
                                    <img src={`${path}${slide.image}`} alt={slide.title} className="h-auto max-h-[600px] w-full object-cover" />
                                </a>
                            ) : (
                                <img src={`${path}${slide.image}`} alt={slide.title} className="h-auto max-h-[600px] w-full object-cover" />
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {/* Pagination Dots */}

            {/* Navigation Arrows */}
            <div className="flex justify-between items-center gap-2 p-2">
                <div>
                    <div className="flex transform items-center gap-2 px-2">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`size-3 rounded-full transition-colors ${current === index ? 'bg-primary' : 'bg-primary/30'}`}
                            />
                        ))}
                    </div>
                </div>
                <div className='space-x-2'>
                    <CarouselPrevious className="bg-background/50 hover:bg-background static top-0 left-4 z-10 h-10 w-10 -translate-y-0 transform rounded-md border border-neutral-300 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg" />
                    <CarouselNext className="bg-background/50 hover:bg-background static top-0 right-4 z-10 h-10 w-10 -translate-y-0 transform rounded-md border border-neutral-300 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg" />
                </div>
            </div>
        </Carousel>
    );
};

export default MySlide;
