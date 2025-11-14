import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
        icon?: React.ReactNode;
        thumbClassName?: string;
    }
>(({ className, icon, thumbClassName, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            'peer focus-visible:ring-ring data-[state=checked]:bg-input data-[state=unchecked]:bg-input inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white',
            className,
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                'bg-background dark:bg-input pointer-events-none flex h-6 w-6 items-center justify-center rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
                thumbClassName,
            )}
        >
            {icon}
        </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export default function MySelectLanguageSwitch({ className = '' }: { className?: string }) {
    const { currentLocale } = useTranslation();

    const handleToggle = (checked: boolean) => {
        // Refresh full page to new language URL
        if (checked) {
            window.location.href = '/lang/en';
        } else {
            window.location.href = '/lang/kh';
        }
    };

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <Switch
                icon={
                    currentLocale === 'en' ? (
                        <img src="/assets/icons/english.png" className="h-5 w-5 rounded-full" />
                    ) : (
                        <img src="/assets/icons/khmer.png" className="h-5 w-5 rounded-full" />
                    )
                }
                checked={currentLocale === 'en'}
                onCheckedChange={handleToggle}
            />
        </div>
    );
}
