import * as React from 'react';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { MoonIcon, SunMediumIcon } from 'lucide-react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    icon?: React.ReactNode;
    thumbClassName?: string;
  }
>(({ className, icon, thumbClassName, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none flex h-6 w-6 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 items-center justify-center",
        thumbClassName
      )}
    >
      {icon}
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export default function ToggleModeSwitch({ className = '' }: { className?: string }) {
  const { appearance, updateAppearance } = useAppearance();

  const isDark = appearance === 'dark';

  const handleToggle = (checked: boolean) => {
    updateAppearance(checked ? 'dark' : 'light');
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* <SunMediumIcon className="h-4 w-4 text-black dark:text-white" /> */}
      <Switch
        icon={
          isDark ? (
            <MoonIcon className="h-4 w-4 text-white" />
          ) : (
            <SunMediumIcon className="h-4 w-4 text-black dark:text-white" />
          )
        }
        checked={isDark}
        onCheckedChange={handleToggle}
      />
      {/* <MoonIcon className="h-4 w-4 text-neutral-400" /> */}
    </div>
  );
}
