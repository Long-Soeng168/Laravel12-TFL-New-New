import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { ImageOffIcon } from 'lucide-react';

const ShopCard = ({ shop }) => {
    const { t } = useTranslation();
    return (
        <Link
            href={`/shops/${shop.id}`}
            className="w-full max-w-full overflow-hidden border transition-all duration-300 hover:scale-105 hover:rounded-2xl hover:shadow-lg"
        >
            {/* Banner */}
            <div>
                <Avatar className="aspect-[21/9] size-full rounded-none">
                    <AvatarImage src={`/assets/images/shops/thumb/${shop.banner}`} alt="" className="w-full bg-white object-cover" />
                    <AvatarFallback className="rounded-none">
                        <ImageOffIcon size={32} className="text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Content */}
            <div className="flex items-start gap-4 p-2">
                {/* Logo */}
                <div className="shrink-0">
                    <Avatar className="aspect-[1/1] size-14 rounded-none">
                        <AvatarImage
                            src={`/assets/images/shops/${shop.logo}`}
                            alt=""
                            className="size-14 rounded-full border-4 border-white bg-white object-cover shadow-none"
                        />
                        <AvatarFallback className="rounded-none">
                            <ImageOffIcon size={22} className="text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Details */}
                <div>
                    <h2 className="line-clamp-2 text-base font-semibold">{shop.name}</h2>
                    {shop.address && (
                        <p className="text-foreground mt-1 line-clamp-2 text-sm">
                            <span className="font-semibold">{t("Address")}:</span> {shop.address}
                        </p>
                    )}
                    {/* {shop.phone && (
                        <p className="text-foreground mt-1 text-sm">
                            <span className="font-semibold">Phone:</span> {shop.phone}
                        </p>
                    )} */}
                </div>
            </div>
        </Link>
    );
};

export default ShopCard;
