import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Link } from '@inertiajs/react';

export function MyTestimonial() {
    const image = [
        {
            title: 'Asif Ahmed',
            short: 'App Developer',
            des: 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway.',
            src: 'assets/images/boy.png',
            id: 1,
        },
        {
            title: 'Mariya Khan',
            short: 'CEO, Brick Consulting',
            des: 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway.',
            src: 'assets/images/image1.png',
            id: 2,
        },
        {
            title: 'Sonia Akhter',
            short: 'Graphic Designer',
            des: 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway.',
            src: 'assets/images/girl.png',
            id: 3,
        },
        {
            title: 'Deluar Hossen',
            short: 'Deluar Hossen',
            des: 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway.',
            src: 'assets/images/image3.png',
            id: 4,
        },
    ];

    return (
        <Carousel className="mx-auto  max-w-screen-2xl px-4 sm:px-10 md:px-20">
            <CarouselContent >
                {image.map((item) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 ">
                        <Link href={`/detail/${1}`} key={item.id} className="mx-auto flex max-w-xl flex-col overflow-hidden rounded-md">
                            <div>
                                <img
                                    className="w-full  object-cover aspect-square hover:scale-110 transition-all duration-500"
                                    src={item.src}
                                    alt="image"
                                />
                            </div>
                            <div className="relative m-10 -mt-16 bg-white px-4 sm:px-10 pt-5 pb-16">
                                <p
                                    className="mb-2 inline-block text-lg font-semibold transition duration-500 ease-in-out hover:text-indigo-600"
                                >
                                    {item.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                {item.short}
                                </p>
                                <p className="mt-5 text-sm text-gray-600">
                                {item.des}
                                </p>
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className='left-7 md:left-20' />
            <CarouselNext className='right-4 md:right-20' />
        </Carousel>
    );
}
