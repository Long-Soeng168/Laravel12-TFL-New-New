import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import * as React from 'react';
export default function MySlideCareer() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    console.log('current :', current);
    React.useEffect(() => {
        if (!api) {
            return;
        }
        setCurrent(api.selectedScrollSnap() + 1);
        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);
    return (
        <div className="mx-auto max-w-6xl 2xl:max-w-[80vw]">
            <Carousel setApi={setApi} className="w-full max-w-6xl 2xl:max-w-[80vw]" opts={{ loop: true }}>
                <CarouselContent className="ml-0">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index} className={cn('basis-[50%] pl-0 sm:basis-[33%]', {})}>
                            <Card
                                className={cn('border-0 p-0 transition-transform duration-500', {
                                    'scale-[0.6]': index !== current - 1,
                                })}
                            >
                                <CardContent className="flex aspect-square items-center justify-center p-0">
                                    <div className={`flex flex-col overflow-hidden border-[0.5px] transition-all duration-500 hover:shadow-lg`}>
                                        <a href="#">
                                            <img
                                                className="aspect-[1/1] w-full object-cover"
                                                src="/assets/demo-images/Cover.png"
                                                alt="Sunset in the mountains"
                                            />
                                        </a>

                                        <div className="background flex flex-col justify-start p-2">
                                            <div className="mb-4 flex flex-col justify-between">
                                                <a
                                                    href="#"
                                                    className="mb-1 inline-block text-[16px] font-bold text-white transition duration-500 ease-in-out 2xl:text-2xl"
                                                >
                                                    A Visionary Project Manager
                                                </a>
                                                <p className="text-[12px] text-gray-300 2xl:text-base">
                                                    Meet <span className="text-yellow-400">Mr. Try Pidet</span> who is shaping success and leadership
                                                    at the best at Westec
                                                </p>
                                            </div>
                                            <div className="mt-2">
                                                <Dialog>
                                                    <DialogTrigger>
                                                        <span className="font-proxima-nova-regular bg-primary px-4 py-1 text-xs text-white capitalize transition duration-200 hover:underline 2xl:text-xl">
                                                            Read More
                                                        </span>
                                                    </DialogTrigger>
                                                    <DialogContent
                                                        showCloseButton={true}
                                                        className="bg-primary min-w-[95%] gap-0 rounded-none p-0 text-white sm:min-w-[95%]"
                                                    >
                                                        <DialogHeader>
                                                            <DialogTitle className="hidden"></DialogTitle>
                                                            <DialogDescription className="hidden"></DialogDescription>
                                                        </DialogHeader>
                                                        <div className="flex flex-col lg:flex-row">
                                                            <img
                                                                className="order-3 aspect-square h-full w-auto max-w-full object-cover lg:order-1 lg:max-w-[400px]"
                                                                src="/assets/westec/images/career-1.png"
                                                                alt=""
                                                            />
                                                            <div className="order-2 p-2 text-white lg:p-4">
                                                                <div className="mb-4">
                                                                    <h1 className="mt-2 text-xl font-bold">A Visionary Project Manager</h1>
                                                                    <p>
                                                                        Meet <span className="text-yellow-400">Mr. Try Pidet</span> who is shaping
                                                                        success and leadership at the best at Westec
                                                                    </p>
                                                                </div>
                                                                <div className="bg-black/30 p-2">
                                                                    <div className="flex flex-col gap-4 space-y-2 font-medium lg:text-sm">
                                                                        <p>
                                                                            Meet Mr. Try Pidet, our dedicated Project Manager at Westec, whose journey
                                                                            embodies a profound commitment to excellence and a passion for continued
                                                                            learning. From the start of his career, Mr. Pidet has exemplified
                                                                            resilience and innovation, mastering the installation and configuration of
                                                                            cutting-edge technologies like solar systems and walk-through detectors.
                                                                            His ability to tackle technical challenges without formal training
                                                                            showcases his determination and self-driven nature.
                                                                        </p>
                                                                        <p>
                                                                            Over the years, Mr. Pidet has evolved significantly within our
                                                                            organization, starting from IT support and progressing through various
                                                                            roles to become the influential Project Manager he is today. This journey
                                                                            reflects his dedication to personal and professional growth, contributing
                                                                            not only to his own development but also to the overall advancement of our
                                                                            team.
                                                                        </p>
                                                                        <p>
                                                                            Under his leadership, projects are executed not just efficiently but with
                                                                            exceptional quality, setting standards in the industry. He balances his
                                                                            technical expertise with teamwork, ensuring that his team is equipped with
                                                                            the necessary knowledge and skills to meet client needs effectively. For
                                                                            Mr. Pidet, success is measured through timely project completions,
                                                                            satisfied customers, and a well-prepared team ready to tackle any
                                                                            challenges that arise.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="my-8 flex items-center justify-center gap-8">
                    <CarouselPrevious className="relative translate-0" />
                    <CarouselNext className="relative translate-0" />
                </div>
            </Carousel>
        </div>
    );
}
