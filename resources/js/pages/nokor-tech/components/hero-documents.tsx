import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowDown, PhoneCall } from 'lucide-react';

function HeroDocuments() {
    return (
        <div className="w-full pb-20">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            <h1 className="font-regular max-w-lg text-left text-3xl tracking-tighter md:text-5xl">
                                Subscribe to Premium Car Documents!
                            </h1>
                            <p className="text-muted-foreground max-w-md text-left text-xl leading-relaxed tracking-tight">
                                Access official documents for all car brands — service manuals, wiring diagrams, repair guides, and more. Get
                                unlimited downloads, regular updates, and premium support starting today!
                            </p>
                        </div>
                        <div className="flex flex-row gap-4">
                            <Link href={`/contact-us`}>
                                <Button size="lg" className="gap-4" variant="outline">
                                    Talk to Us <PhoneCall className="h-4 w-4" />
                                </Button>
                            </Link>

                            <Link href={`/documents#pricing`}>
                                <Button size="lg" className="gap-4">
                                    Subscribe Now <ArrowDown className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-muted aspect-square rounded-md"></div>
                        <div className="bg-muted row-span-2 rounded-md"></div>
                        <div className="bg-muted aspect-square rounded-md"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroDocuments;
