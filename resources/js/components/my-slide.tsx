import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

const MySlide = ({ className, images = [] }: { className?: string; images?: any }) => {
    images = [
        {
            id: '1',
            image: '/assets/westec/images/banner1.jpeg',
            alt: 'image 1',
            short: 'Safety and security don’t just happen; <strong>CCTV</strong> is an investment in protection',
            bg: '#273896',
        },
        {
            id: '2',
            image: '/assets/westec/images/banner2.jpeg',
            alt: 'image 2',
            short: 'Your safety starts at the door—let an <strong>Access Control System</strong> decide who comes through.',
            bg: '#008080',
        },
        {
            id: '3',
            image: '/assets/westec/images/banner3.jpeg',
            alt: 'image 3',
            short: 'Peace of mind begins with protection—<strong>Intrusion Alarms</strong> ensure you sleep soundly.',
            bg: '#36454f',
        },
        {
            id: '4',
            image: '/assets/westec/images/banner4.jpeg',
            alt: 'image 4',
            short: 'The sun never send a bill—<strong>Smart Solar Energy System</strong> turn its power savings.',
            bg: '#008080',
        },
        {
            id: '5',
            image: '/assets/westec/images/banner2.jpeg',
            alt: 'image 5',
            short: 'A smart home isn"t just about convenice—it"s about control.Automate your world with a <strong>Smart Home Automation System</strong>.',
            bg: '#273896',
        },
    ];

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
    return (
        <div className={className}>
            {images.length > 0 && (
                <Carousel
                    plugins={[
                        Autoplay({
                            delay: 3000,
                        }),
                    ]}
                    opts={{ align: 'start', loop: false }}
                    setApi={setApi}
                    className='bg-true-primary m-0'
                >
                    <CarouselContent>
                        {images.map((image) => (
                            <CarouselItem key={image.id} className='pl-0'>
                                <Link href={image.link || '#'}>
                                    <img
                                        className={`w-full object-cover transition-all duration-500 ${
                                            image.link ? 'border-primary hover:scale-95 hover:border-2' : ''
                                        }`}
                                        // width={1050}
                                        // height={300}
                                        src={image.image}
                                        alt={image.name}
                                    />
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2 py-2">
                        {Array.from({ length: count }).map((_, index) => (
                            <div key={index} className={`size-3 rounded-full ${current === index + 1 ? 'bg-primary' : 'bg-white'}`}></div>
                        ))}
                    </div>

                    {/* <CarouselPrevious className="rounded-none max-md:hidden" />
          <CarouselNext className="rounded-none max-md:hidden" /> */}
                </Carousel>
            )}
        </div>
    );
};

export default MySlide;
