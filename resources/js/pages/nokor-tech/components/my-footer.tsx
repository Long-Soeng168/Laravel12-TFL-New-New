import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { Separator } from './ui/separator';

export default function MyFooter() {
    const { application_info, links } = usePage().props;
    const { t } = useTranslation();
    return (
        <footer className="bg-true-primary dark relative border-t text-white dark:bg-black">
            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:px-8">
                {/* Background Banner */}
                <div className="absolute right-0 bottom-0 z-0 h-auto w-full max-w-[2000px]">
                    <img
                        src="/assets/backgrounds/footer_banner_for_light.png"
                        alt=""
                        className="z-0 w-[100%] max-w-7xl object-contain opacity-[15%] dark:hidden"
                    />
                    <img
                        src="/assets/backgrounds/footer_banner_for_dark.png"
                        alt=""
                        className="z-0 hidden w-[100%] max-w-7xl object-contain opacity-[40%] lg:opacity-[15%] dark:block"
                    />
                </div>
                <div className="relative grid grid-cols-1 gap-2 lg:grid-cols-4">
                    <div className="justify-self-center">
                        {application_info?.image && (
                            <div className="flex flex-col items-center justify-center">
                                <img
                                    width={65}
                                    height={65}
                                    src={`/assets/images/application_info/thumb/${application_info?.image}`}
                                    alt={`${application_info?.name}'s logo`}
                                    className="rounded-full hover:cursor-pointer"
                                />
                                <p className="mt-2 text-2xl font-bold">{application_info?.name}</p>
                            </div>
                        )}
                        <div className="mt-8 mb-4 w-auto">
                            <PWAInstallPrompt />
                        </div>
                    </div>
                    {/* Company Info */}
                    <div className="max-lg:hidden lg:justify-self-center">
                        <h3 className="mb-4 text-xl font-bold">
                            {t('Information')} <Separator className="w-auto bg-white" />
                        </h3>
                        <ul className="flex flex-col gap-1">
                            <li className="flex">
                                <span>{application_info?.address}</span>
                            </li>
                            <li className="flex">
                                <span className="mr-2 font-semibold">{t('Phone')}:</span>
                                <a className="hover:underline" href={`tel:${application_info?.phone}`}>
                                    {application_info?.phone}
                                </a>
                            </li>
                            <li className="flex">
                                <span className="mr-2 font-semibold">{t('Email')}:</span>
                                <a className="hover:underline" href={`mailto:${application_info?.email}`}>
                                    {application_info?.email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="max-lg:hidden lg:justify-self-center">
                        <h3 className="mb-4 text-xl font-bold">
                            {t('Quick Links')} <Separator className="w-auto bg-white" />
                        </h3>

                        <ul className="space-y-2">
                            <li>
                                <Link prefetch href="/" className="hover:underline">
                                    {t('Home')}
                                </Link>
                            </li>
                            <li>
                                <Link prefetch href="/products" className="hover:underline">
                                    {t('Products')}
                                </Link>
                            </li>
                            <li>
                                <Link prefetch href="/shops" className="hover:underline">
                                    {t('Shops')}
                                </Link>
                            </li>
                            <li>
                                <Link prefetch href="/privacy" className="hover:underline">
                                    {t('Privacy')}
                                </Link>
                            </li>
                            <li>
                                <Link prefetch href="/contact-us" className="hover:underline">
                                    {t('Contact')}
                                </Link>
                            </li>
                            <li>
                                <Link prefetch href="/about-us" className="hover:underline">
                                    {t('About')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="max-lg:hidden lg:justify-self-center">
                        <h3 className="mb-4 text-xl font-bold">
                            {t('Social Media')} <Separator className="w-auto bg-white" />
                        </h3>
                        <ul className="space-y-3">
                            {links?.map((item) => (
                                <li key={item?.id}>
                                    <Link prefetch href={item?.link || '#'} className="flex items-center gap-2 hover:underline">
                                        <img
                                            width={28}
                                            height={28}
                                            src={`/assets/images/links/thumb/${item?.image}`}
                                            alt=""
                                            className="transition-all duration-300 hover:scale-125 hover:cursor-pointer"
                                        />
                                        {item?.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="min-lg:hidden pb-7 lg:justify-self-center">
                        <h3 className="mb-4 text-xl text-center underline underline-offset-8 font-bold">
                            {t('Social Media')} 
                        </h3>
                        <ul className="flex flex-wrap justify-center gap-3">
                            {links?.map((item) => (
                                <li key={item?.id}>
                                    <Link prefetch href={item?.link || '#'} className="flex border rounded-full items-center gap-2 hover:underline">
                                        <img
                                            width={28}
                                            height={28}
                                            src={`/assets/images/links/thumb/${item?.image}`}
                                            alt=""
                                            className="transition-all size-12 duration-300 hover:scale-125 hover:cursor-pointer"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="relative z-10 mx-auto max-w-7xl pb-18 sm:pb-0">
                {/* Footer Bottom */}
                <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
                    <p className="text-sm">{application_info?.copyright}</p>
                    {/* <a className="text-sm" href="#">
                        {t('Developed by')} : <strong></strong>
                    </a> */}
                    <div className="flex items-center space-x-[10px] text-[18px] font-semibold">
                        <p>We accept:</p>
                        <div className="flex gap-[10px]">
                            <img className="h-[40px]" src="/assets/visacard-logo.png" alt="" />
                            <img className="h-[40px] bg-white p-1 px-2.5" src="/assets/mastercard-logo.svg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
