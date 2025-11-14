
import { Card } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

export function MyBlogSlide() {
    const images = [
        { id: '1', image: '/assets/images/blog.png', alt: 'Slide 1' },
        { id: '2', image: '/assets/images/blog.png', alt: 'Slide 2' },
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi]);

    return (
        <div className="relative mx-auto w-full max-w-full ">
            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {images?.map((item) => (
                        <div key={item.id} className="flex-[0_0_100%]">
                            <Card className="relative aspect-[16/9] sm:aspect-[19/7] md:aspect-[19/6] w-full rounded-none py-0">
                                <img src={item.image} alt={item.alt} className="w-full h-full object-cover" />
                                <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-black">
                                    <div className="mx-auto max-w-screen-lg text-center sm:max-w-screen-xl md:max-w-screen-2xl p-5 sm:10 md:p-20 lg:p-20">
                                        <h3 className="max-w-full text-sm sm:text-lg md:text-2xl lg:text-4xl xl:text-5xl font-bold">
                                            Blog
                                        </h3>
                                        <p className="mt-2 sm:mt-3 md:mt-5 text-xs sm:text-sm md:text-base">
                                            Empowering businesses and institutions with cutting-edge software solutions, crafted precisely for your
                                            unique challenges.
                                        </p>

                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            {/* Dot Navigation */}
            <div className="absolute bottom-3 sm:bottom-8 left-1/2 flex -translate-x-1/2 transform space-x-2">
                {images?.map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition ${index === selectedIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                        onClick={() => emblaApi && emblaApi.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    );
}
