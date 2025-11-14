import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

const MyProductListHeader = ({ title, image, link = '#' }: { title: string; image?: string; link?: string }) => {
    const { t, currentLocale } = useTranslation();
    return (
        <div className="border-muted mx-2 mb-4 flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
                {image && (
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded">
                        <img src={image} alt={title} className="h-6 w-6 object-contain" />
                    </div>
                )}
                <h2 className="text-foreground text-xl font-semibold">{t(title)}</h2>
            </div>

            <Link href={link} className="group text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-all">
                {t('See More')}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    );
};

export default MyProductListHeader;
