import { Appearance, useAppearance } from '@/hooks/use-appearance';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function ToggleModeTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { t } = useTranslation();
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: t('Light') },
        { value: 'dark', icon: Moon, label: t('Dark') },
        { value: 'system', icon: Monitor, label: t('System') },
    ];

    return (
        <div className={cn('my-1 inline-flex w-full justify-between gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center flex-1 justify-center rounded-md px-1.5 py-1.5 transition-colors',
                        appearance === value
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <Icon className="mr-1 h-4 w-4" />
                    <span className="text-xs">{label}</span>
                </button>
            ))}
        </div>
    );
}
