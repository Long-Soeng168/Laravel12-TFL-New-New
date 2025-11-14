import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { GripIcon, HomeIcon, PhoneCallIcon, StoreIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BottomMobileNav({ className }: { className?: any }) {
    const [activeTab, setActiveTab] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [pathname, setPathname] = useState('');
    const [search, setSearch] = useState('');

    const { t } = useTranslation();

    const items = [
        { name: t('Home'), url: '/', icon: HomeIcon },
        { name: t('Products'), url: '/products', icon: GripIcon },
        { name: t('Shops'), url: '/shops', icon: StoreIcon },
        { name: t('Contact'), url: '/contact-us', icon: PhoneCallIcon },
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPathname(window.location.pathname);
            setSearch(window.location.search);
            setActiveTab(window.location.pathname + window.location.search);

            const handleResize = () => setIsMobile(window.innerWidth < 768);
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const isCurrent = (item) => {
        if (!pathname) return false;

        const currentSearch = new URLSearchParams(search);

        if (item.url.startsWith('/products')) {
            if (item.name === 'Products') {
                return pathname === '/products' && !currentSearch.has('specialOffer');
            } else if (item.name === 'Special Offer') {
                return pathname === '/products' && currentSearch.get('specialOffer') === '1';
            }
        }
        return pathname === item.url;
    };

    return (
        <div className={cn('fixed bottom-0 left-1/2 z-50 mb-4 -translate-x-1/2 sm:top-0 sm:pt-4', className)}>
            <div className="border-border bg-background/40 flex items-center rounded-full border px-1 py-1 shadow-lg backdrop-blur-lg sm:hidden">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = isCurrent(item);

                    return (
                        <Link
                            key={item.name}
                            href={item.url}
                            onClick={() => setActiveTab(item.url)}
                            className={cn(
                                'relative cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                                'text-foreground/80 hover:text-primary',
                                isActive && 'bg-muted text-primary',
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="flex flex-col items-center md:hidden">
                                <Icon size={18} strokeWidth={2.5} />
                                <span className="text-xs whitespace-nowrap">{item.name}</span>
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="bg-primary/5 absolute inset-0 -z-10 w-full rounded-full"
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="bg-primary absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full">
                                        <div className="bg-primary/20 absolute -top-2 -left-2 h-6 w-12 rounded-full blur-md" />
                                        <div className="bg-primary/20 absolute -top-1 h-6 w-8 rounded-full blur-md" />
                                        <div className="bg-primary/20 absolute top-0 left-2 h-4 w-4 rounded-full blur-sm" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
