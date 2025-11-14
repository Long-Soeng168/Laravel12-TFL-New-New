import { BottomMobileNav } from '@/components/BottomMobileNav';
import NavLanguage from '@/components/NavLanguage';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { TopDesktopNav } from '@/components/TopDesktopNav';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { LayoutIcon, Menu, Settings, StoreIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CartButton from './cart-button';
import { HomeUserButton } from './home-user-button';
import { MySearchProducts } from './my-search-products';
import MySearchProductsDialog from './my-search-products-dialog';

const MyHeader = () => {
    const { application_info, auth } = usePage().props;

    const { t, currentLocale } = useTranslation();

    const navItems2 = [
        { label: t('Home'), href: '/' },
        { label: t('Products'), href: '/products' },
        { label: t('Shops'), href: '/shops' },
        // { label: t('Privacy'), href: '/privacy' },
        // { label: t('About'), href: '/about-us' },
        // { label: t('Contact'), href: '/contact-us' },
    ];

    const hasRole = useRole();

    const renderNavLink = ({ label, href }) => {
        const isActive = typeof window !== 'undefined' ? window.location.pathname === href : false;

        return (
            <Link prefetch href={href} className={`group relative cursor-pointer ${isActive ? 'text-primary font-bold' : ''} hover:text-primary`}>
                {label}
                <span
                    className={`bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full ${isActive ? 'w-full' : ''}`}
                ></span>
            </Link>
        );
    };

    const stickyRef = useRef(null);
    const [isStuck, setIsStuck] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsStuck(!entry.isIntersecting);
            },
            {
                threshold: 1.0,
            },
        );

        if (stickyRef.current) observer.observe(stickyRef.current);

        return () => {
            if (stickyRef.current) observer.unobserve(stickyRef.current);
        };
    }, []);

    return (
        <>
            {/* Top Bar */}
            <nav className="bg-background text-foreground">
                <div className="mx-auto flex min-h-10 max-w-screen-xl flex-wrap items-center justify-between py-2 pl-4 text-sm lg:pl-0">
                    {application_info?.image && (
                        <Link prefetch href="/" className="flex items-center gap-2">
                            <img
                                width={65}
                                height={65}
                                src={`/assets/images/application_info/thumb/${application_info.image}`}
                                alt={`${application_info.name}'s logo`}
                                className="rounded-md"
                            />
                            <div>
                                <p className="text-xl font-bold">{application_info.name_kh}</p>
                                <p className="text-xl font-bold">{application_info.name}</p>
                            </div>
                        </Link>
                    )}
                    <div className="flex max-w-full flex-1 items-center justify-end lg:justify-self-center">
                        <div className="mx-10 hidden flex-1 md:block lg:mx-20">
                            <MySearchProducts />
                        </div>
                        <div className="text-primary mx-2 md:hidden">
                            <MySearchProductsDialog />
                        </div>
                        <div className="max-md:hidden">
                            <HomeUserButton />
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-4 px-4 font-semibold">
                        <Link prefetch href="/download-app" className="rainbow-button flex items-center gap-2 pr-4 pl-2 text-sm lg:text-lg">
                            <img src="/assets/icons/phone-car.png" alt="Download App" className="aspect-square w-10 object-contain py-1 lg:w-12" />
                            {t('Download App')}
                        </Link>
                    </div> */}
                </div>
            </nav>

            {/* Main Header */}
            <div ref={stickyRef} className="h-1" />
            <div className="bg-background sticky top-0 z-50 border-b border-white shadow-sm backdrop-blur-md">
                <div className="mx-auto flex max-w-screen-xl items-center justify-between py-3 lg:py-4">
                    {/* Mobile Menu */}
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger>
                                <Menu className="text-primary mx-4 size-8 lg:hidden" />
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-background w-64 shadow-md">
                                <SheetHeader>
                                    <SheetTitle className="text-2xl font-bold">{t('Menu')}</SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col gap-6 px-4 font-semibold">
                                    <hr />
                                    {navItems2.map(renderNavLink)}
                                </div>
                                {auth?.user && (
                                    <>
                                        <Separator className="my-4" />
                                        <div className="flex flex-col gap-6 px-4 font-semibold">
                                            <Link
                                                prefetch
                                                href={`/settings/profile`}
                                                className={`group hover:text-primary relative flex w-full cursor-pointer items-center`}
                                            >
                                                <Settings className="mr-2" />
                                                {t('Settings')}
                                                <span
                                                    className={`bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full`}
                                                ></span>
                                            </Link>
                                            {hasRole('Admin') && (
                                                <Link
                                                    prefetch
                                                    href={`/dashboard`}
                                                    className={`group hover:text-primary relative flex w-full cursor-pointer items-center`}
                                                >
                                                    <LayoutIcon className="mr-2" />
                                                    {t('Dashboard')}
                                                    <span
                                                        className={`bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full`}
                                                    ></span>
                                                </Link>
                                            )}
                                            {hasRole('Shop') && (
                                                <Link
                                                    prefetch
                                                    href={`/user-dashboard`}
                                                    className={`group hover:text-primary relative flex w-full cursor-pointer items-center`}
                                                >
                                                    <StoreIcon className="mr-2" /> {t('Shop Dashboard')}
                                                    <span
                                                        className={`bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full`}
                                                    ></span>
                                                </Link>
                                            )}
                                        </div>
                                    </>
                                )}
                                <Separator className="my-4" />
                                <div className="flex gap-4 px-4 min-md:hidden">
                                    <AnimatedThemeToggler />
                                    <NavLanguage />
                                </div>
                                <Separator className="my-4" />
                                <PWAInstallPrompt />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden flex-1 lg:flex">
                        <TopDesktopNav />
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-4">
                        <div className={cn(!isStuck && 'hidden', 'text-primary')}>
                            <MySearchProductsDialog />
                        </div>

                        {/* <Link prefetch href="/shopping-cart"> */}
                        <CartButton />
                        {/* </Link> */}
                        <div className="min-md:hidden">
                            <HomeUserButton />
                        </div>
                        <div className="mr-2 flex gap-4 max-md:hidden">
                            {/* <MySelectLanguageSwitch /> */}
                            <AnimatedThemeToggler />
                            <NavLanguage />
                            {/* <ToggleModeSwitch /> */}
                        </div>
                    </div>
                </div>
            </div>

            <BottomMobileNav />
        </>
    );
};

export default MyHeader;
