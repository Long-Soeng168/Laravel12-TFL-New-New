
import { Card } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

export function MyClient() {
    const images = [
        {
            id: '1',
            image: '/assets/demo-images/client1.png',
            alt: 'Slide 1',
            short: 'Safety and security don’t just happen; <strong>CCTV</strong> is an investment in protection',
            bg: '#273896',
        },
        {
            id: '2',
            image: '/assets/demo-images/client4.png',
            alt: 'Slide 2',
            short: 'Your safety starts at the door—let an <strong>Access Control System</strong> decide who comes through.',
            bg: '#008080',
        },
        {
            id: '2',
            image: '/assets/demo-images/client3.png',
            alt: 'Slide 2',
            short: 'Your safety starts at the door—let an <strong>Access Control System</strong> decide who comes through.',
            bg: '#008080',
        },
        {
            id: '2',
            image: '/assets/demo-images/client6.png',
            alt: 'Slide 2',
            short: 'Your safety starts at the door—let an <strong>Access Control System</strong> decide who comes through.',
            bg: '#008080',
        },
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi]);

    return (
        <>
            <h1 className="inline-block mx-auto pt-4 px-4 sm:pt-8 sm:px-8 md:pt-12 md:px-12 w-full bg-white text-2xl font-semibold text-[#273892]">Our Clients</h1>
            <div className="relative mx-auto w-full">
                {/* Carousel */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {images?.map((item) => (
                            <div key={item.id} className="flex-[0_0_100%]">
                                <Card className="relative h-48 w-full  rounded-none py-0">
                                    <img src={item.image} alt={item.alt} className=" h-48 w-full object-cover" />
                                    {/* <div className="absolute top-0 left-0 bottom-0 h-full w-[30%]" style={{ background: item.bg }}>
                                    <div className="mx-auto flex justify-center items-center max-w-screen-lg sm:max-w-screen-xl md:max-w-screen-2xl h-full px-4 sm:px-8 md:px-12">
                                        <h3 className="max-w-full text-sm text-white sm:text-lg md:text-2xl xl:text-2xl font-proxima-nova-regular" dangerouslySetInnerHTML={{ __html: item.short }} />
                                    </div>
                                </div> */}
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Dot Navigation */}
                {/* <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-2 sm:bottom-4">
                    {images?.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 w-2 rounded-full transition sm:h-3 sm:w-3 ${index === selectedIndex ? 'bg-[#273896]' : 'bg-gray-300'}`}
                            onClick={() => emblaApi && emblaApi.scrollTo(index)}
                        />
                    ))}
                </div> */}
            </div>
        </>
    );
}
