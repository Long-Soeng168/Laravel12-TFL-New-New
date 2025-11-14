import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

interface SlideItem {
    id: number;
    title: string;
    link: string | null;
    image: string;
}

interface MyMiddleSlideProps {
    slides: SlideItem[];
    path?: string;
}

const MyMiddleSlide: React.FC<MyMiddleSlideProps> = ({ slides, path = '' }) => {
    const [api, setApi] = React.useState<CarouselApi | null>(null);

    return (
        <Carousel
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
            opts={{ align: 'start', loop: true }}
            setApi={setApi}
            className="relative my-10 px-2"
        >
            <CarouselContent>
                {slides.map((slide) => (
                    <CarouselItem
                        key={slide.id}
                        className="basis-1/2 cursor-pointer pl-2 transition-all duration-500 hover:scale-95 lg:basis-1/3 lg:pl-4"
                    >
                        <div>
                            {slide.link ? (
                                <a href={slide.link}>
                                    <img
                                        src={`${path}${slide.image}`}
                                        alt={slide.title}
                                        className="aspect-video w-full object-cover"
                                        width={900}
                                        height={500}
                                    />
                                </a>
                            ) : (
                                <img
                                    src={`${path}${slide.image}`}
                                    alt={slide.title}
                                    className="aspect-video w-full object-cover"
                                    width={900}
                                    height={500}
                                />
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="absolute top-1/2 -left-2 z-10 -translate-y-1/2 transform" />
            <CarouselNext className="absolute top-1/2 -right-2 z-10 -translate-y-1/2 transform" />
        </Carousel>
    );
};

export default MyMiddleSlide;
