import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Link } from '@inertiajs/react';
import { StoreIcon } from 'lucide-react';

export function ShopHoverCard({ shop }: { shop: any }) {
    return (
        <HoverCard openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button className="h-7" variant="outline">
                    {shop?.name}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[300px] lg:w-[360px]">
                <div className="flex justify-start gap-4">
                    <div className='flex flex-col items-center justify-start'>
                        <Avatar className="size-12 lg:size-16">
                            <AvatarImage src={`/assets/images/shops/thumb/${shop?.logo}`} />
                            <AvatarFallback>
                                <StoreIcon />
                            </AvatarFallback>
                        </Avatar>
                        <Button variant={`link`} size="sm" className="m-0 p-0">
                            <Link className='text-xs' href={`/shops/${shop?.id}`}>View Shop</Link>
                        </Button>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-base font-semibold">{shop?.name}</h4>
                        <p className="text-base">Phone : {shop?.phone}</p>
                        <div className="text-muted-foreground text-sm">Category : {shop?.category_code || '---'}</div>
                        <div className="text-muted-foreground line-clamp-4 text-sm">Address : {shop?.address || '---'}</div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
