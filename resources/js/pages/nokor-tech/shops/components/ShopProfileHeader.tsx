import MyNoData from '@/components/my-no-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { ImageOffIcon } from 'lucide-react';
const ShopProfileHeader = ({ shop }) => {
    const { t } = useTranslation();
    return (
        <div className="mb-8 w-full px-4 md:mb-28">
            {/* Banner */}
            <div className="relative">
                <Avatar className="size-full rounded-none">
                    <AvatarImage src={`/assets/images/shops/${shop.banner}`} alt="" className="aspect-[21/6] max-h-[500px] w-full object-cover" />
                    <AvatarFallback className="rounded-none">
                        <ImageOffIcon size={32} className="text-muted-foreground h-[220px]" />
                    </AvatarFallback>
                </Avatar>
                {/* <img src={`/assets/images/shops/${shop.banner}`} alt="Shop Banner" className="max-h-[500px] w-full object-cover" /> */}
                {/* Logo */}
                <div className="bg-background/80 -bottom-16 left-0 flex max-w-full items-center space-x-4 rounded-none border p-4 shadow-md backdrop-blur md:absolute md:left-6 md:max-w-[600px]">
                    <Avatar className="size-auto rounded-full border">
                        <AvatarImage
                            src={`/assets/images/shops/${shop.logo}`}
                            alt=""
                            className="h-24 w-24 rounded-full border-4 border-transparent bg-white object-cover"
                        />
                        <AvatarFallback className="p-6">
                            <ImageOffIcon size={32} className="text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h1 className="text-2xl font-bold">{shop.name}</h1>
                        <div>
                            {shop.address && (
                                <p>
                                    <span className="font-semibold">{t('Address')}:</span> {shop.address}
                                </p>
                            )}
                            {/* {shop.phone && (
                                <p>
                                    <span className="font-semibold">Phone:</span> {shop.phone}
                                </p>
                            )} */}
                            <div className="absolute right-1 bottom-1">
                                <Dialog>
                                    <DialogTrigger className="text-primary bg-background/50 cursor-pointer rounded-lg p-1 px-2 backdrop-blur-md hover:underline">
                                        {t('About')}
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{shop.name}</DialogTitle>
                                            <DialogDescription className="whitespace-pre-line">
                                                {shop.short_description || <MyNoData />}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopProfileHeader;
