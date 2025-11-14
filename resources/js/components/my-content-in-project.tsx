import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function MyContentInProject() {
    const image = [
        {
            title: 'Platform Integration',
            des:'IT Technology',
            src: 'assets/images/about1.png',
            id: 1,
        },
        {
            title: 'Innovative Interfaces',
            des:'IT Technology',
            src: 'assets/images/image1.png',
            id: 2,
        },
        {
            title: 'Growth Strategies',
            des:'IT Technology',
            src: 'assets/images/image2.png',
            id: 3,
        },
        {
            title: 'Analytic Solutions',
            des:'IT Technology',
            src: 'assets/images/image3.png',
            id: 4,
        },
    ];

    return (
        <Carousel className="w-full  sm:px-10 md:px-20">
            <CarouselContent className="">
                {image.map((item) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                        <div className="w-full group/card">
                            <div className="relative mx-auto flex h-96 cursor-pointer flex-col justify-end overflow-hidden rounded-md bg-black p-4 shadow-xl">
                                <img
                                    src={item.src}
                                    className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                    alt="Author"
                                />
                                <div className="absolute inset-0 bg-black opacity-60 transition-opacity duration-500 group-hover/card:opacity-80"></div>

                                <div className="relative z-10 p-4 text-white">
                                    <h1 className="text-xl font-bold md:text-2xl">{item.title}</h1>
                                    <p className="mt-2 text-sm font-normal">
                                    {item.des}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className='left-0 md:left-20'/>
            <CarouselNext className='right-0 md:right-20'/>
        </Carousel>
    );
}
