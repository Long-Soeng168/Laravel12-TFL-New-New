import { MyTooltipButton } from '@/components/my-tooltip-button';
import useRole from '@/hooks/use-role';
import { Link, usePage } from '@inertiajs/react';
import { PackageIcon, StoreIcon, UserIcon } from 'lucide-react';

const SectionCards = () => {
    const { item_counts, garage_post_counts, auth } = usePage().props;
    const hasRole = useRole();

    return (
        <div>
            <div className={`mx-auto grid max-w-full grid-cols-2 gap-4 xl:flex`}>
                {/* Profile Settings */}
                {hasRole('User') && (
                    <Link
                        prefetch
                        href="/settings/profile"
                        className="border-primary/20 flex flex-1 flex-col items-center justify-start gap-4 rounded-xl border px-5 py-6 transition-all duration-300 hover:-translate-1.5 hover:rounded hover:shadow-[5px_5px_rgba(104,_96,_255,_0.4),_10px_10px_rgba(104,_96,_255,_0.3),_15px_15px_rgba(104,_96,_255,_0.2),_20px_20px_rgba(104,_96,_255,_0.1),_25px_25px_rgba(104,_96,_255,_0.05)]"
                    >
                        <div className="bg-primary/10 flex aspect-square h-16 items-center justify-center rounded-full">
                            <UserIcon className="stroke-primary aspect-square size-7 object-contain" />
                        </div>
                        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                            <span className="text-lg font-bold underline-offset-4 hover:underline">Profile Settings</span>
                        </div>
                    </Link>
                )}

                {/* Shop Settings */}
                {hasRole('Shop') && (
                    <Link
                        prefetch
                        href={`${auth?.shop?.id ? '/user-shops/update' : '/user-shops/create'}`}
                        className="border-primary/20 flex flex-1 flex-col items-center justify-start gap-4 rounded-xl border px-5 py-6 transition-all duration-300 hover:-translate-1.5 hover:rounded hover:shadow-[5px_5px_rgba(104,_96,_255,_0.4),_10px_10px_rgba(104,_96,_255,_0.3),_15px_15px_rgba(104,_96,_255,_0.2),_20px_20px_rgba(104,_96,_255,_0.1),_25px_25px_rgba(104,_96,_255,_0.05)]"
                    >
                        <div className="bg-primary/10 flex aspect-square h-16 items-center justify-center rounded-full">
                            <StoreIcon className="stroke-primary aspect-square size-7 object-contain" />
                        </div>
                        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                            <span className="text-lg font-bold underline-offset-4 hover:underline">Your Shop</span>
                            <div className="mt-1 space-y-1 text-sm text-gray-500">
                                <MyTooltipButton title="View Items" variant="ghost" className="h-auto p-0">
                                    <Link href="/user-items" className="text-primary hover:underline hover:underline-offset-4">
                                        (Items: {item_counts})
                                    </Link>
                                </MyTooltipButton>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Garage Settings */}
                {/* {hasRole('Garage') && (
                    <Link
                        prefetch
                        href={`${auth?.garage?.id ? '/user-garages/update' : '/user-garages/create'}`}
                        className="border-primary/20 flex flex-1 flex-col items-center justify-start gap-4 rounded-xl border px-5 py-6 transition-all duration-300 hover:-translate-1.5 hover:rounded hover:shadow-[5px_5px_rgba(104,_96,_255,_0.4),_10px_10px_rgba(104,_96,_255,_0.3),_15px_15px_rgba(104,_96,_255,_0.2),_20px_20px_rgba(104,_96,_255,_0.1),_25px_25px_rgba(104,_96,_255,_0.05)]"
                    >
                        <div className="bg-primary/10 flex aspect-square h-16 items-center justify-center rounded-full">
                            <CarIcon className="stroke-primary aspect-square size-7 object-contain" />
                        </div>
                        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                            <span className="text-lg font-bold underline-offset-4 hover:underline">Your Garage</span>
                            <div className="mt-1 space-y-1 text-sm text-gray-500">
                                <MyTooltipButton title="View Posts" variant="ghost" className="h-auto p-0">
                                    <Link href="/user-garage_posts" className="text-primary hover:underline hover:underline-offset-4">
                                        (Posts: {garage_post_counts})
                                    </Link>
                                </MyTooltipButton>
                            </div>
                        </div>
                    </Link>
                )} */}

                {/* User Plans */}
                {/* {hasRole('User') && (
                    <Link
                        prefetch
                        href="/user/plans"
                        className="border-primary/20 flex flex-1 flex-col items-center justify-start gap-4 rounded-xl border px-5 py-6 transition-all duration-300 hover:-translate-1.5 hover:rounded hover:shadow-[5px_5px_rgba(104,_96,_255,_0.4),_10px_10px_rgba(104,_96,_255,_0.3),_15px_15px_rgba(104,_96,_255,_0.2),_20px_20px_rgba(104,_96,_255,_0.1),_25px_25px_rgba(104,_96,_255,_0.05)]"
                    >
                        <div className="bg-primary/10 flex aspect-square h-16 items-center justify-center rounded-full">
                            <PackageIcon className="stroke-primary aspect-square size-7 object-contain" />
                        </div>
                        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                            <span className="text-lg font-bold underline-offset-4 hover:underline">User Plans</span>
                        </div>
                    </Link>
                )} */}
            </div>

            <hr className="mt-6" />

            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {!hasRole('Shop') && (
                    <Link
                        prefetch
                        href="/user-shops/create"
                        className="flex flex-row items-center justify-start gap-4 rounded-xl border border-black/20 px-5 py-2 transition-all duration-300 hover:-translate-1.5 hover:rounded hover:shadow-[5px_5px_rgba(104,_96,_255,_0.4),_10px_10px_rgba(104,_96,_255,_0.3),_15px_15px_rgba(104,_96,_255,_0.2),_20px_20px_rgba(104,_96,_255,_0.1),_25px_25px_rgba(104,_96,_255,_0.05)]"
                    >
                        <div className="bg-foreground/10 flex aspect-square h-10 items-center justify-center rounded-full">
                            <StoreIcon className="stroke-forgbg-foreground aspect-square size-7 object-contain" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-lg font-bold underline-offset-4 hover:underline">Register Shop</span>
                        </div>
                    </Link>
                )}
                {/* {!hasRole('Garage') && (
                    <Link
                        prefetch
                        href="/user-garages/create"
                        className="border-forgbg-foreground/20 flex flex-row items-center justify-start gap-4 rounded-xl border px-5 py-2 transition-all duration-300 hover:-translate-1.5 hover:rounded hover:shadow-[5px_5px_rgba(104,_96,_255,_0.4),_10px_10px_rgba(104,_96,_255,_0.3),_15px_15px_rgba(104,_96,_255,_0.2),_20px_20px_rgba(104,_96,_255,_0.1),_25px_25px_rgba(104,_96,_255,_0.05)]"
                    >
                        <div className="bg-foreground/10 flex aspect-square h-10 items-center justify-center rounded-full">
                            <CarIcon className="stroke-forgbg-foreground aspect-square size-7 object-contain" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-lg font-bold underline-offset-4 hover:underline">Register Garage</span>
                        </div>
                    </Link>
                )} */}
            </div>
        </div>
    );
};

export default SectionCards;
