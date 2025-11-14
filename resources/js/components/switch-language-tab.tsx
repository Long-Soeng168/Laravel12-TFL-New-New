import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { HTMLAttributes } from 'react';

export default function SwitchLanguageTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { t, currentLocale } = useTranslation();
    const tabs: { value: string; icon: string; label: string }[] = [
        { value: 'kh', icon: '/assets/icons/khmer.png', label: t('Khmer') },
        { value: 'en', icon: '/assets/icons/english.png', label: t('English') },
    ];

    return (
        <div className={cn('my-1 inline-flex w-auto justify-start gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800', className)} {...props}>
            {tabs.map(({ value, icon, label }) => (
                <Link href={`/lang/${value}`}>
                    <button
                        key={value}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors',
                            currentLocale === value
                                ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                        )}
                    >
                        {icon && <img src={icon} alt="" className={`aspect-square w-4 rounded-sm object-contain lg:w-4`} />}
                        <span className="text-xs">{label}</span>
                    </button>
                </Link>
            ))}
        </div>
    );
}
