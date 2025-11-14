import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Link } from '@inertiajs/react';
import { UserIcon } from 'lucide-react';

export function UserHoverCard({ user }: { user: any }) {
    return (
        <HoverCard openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button className="h-7" variant="outline">
                    {user?.name}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[300px] lg:w-[360px]">
                <div className="flex justify-start gap-4">
                    <div className="flex flex-col items-center justify-start">
                        <Avatar className="size-12 lg:size-16">
                            <AvatarImage src={`/assets/images/users/thumb/${user?.logo}`} />
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>
                        {/* <Button variant={`link`} size="sm" className="m-0 p-0">
                            <Link className="text-xs" href={`/admin/users/${user?.id}`}>
                                View Shop
                            </Link>
                        </Button> */}
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-base font-semibold">{user?.name}</h4>
                        <p className="text-base">Phone : {user?.phone}</p>
                        <div className="text-muted-foreground text-sm">Email : {user?.email}</div>
                        <div className="text-muted-foreground text-sm">Gender : {user?.gender || '---'}</div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
