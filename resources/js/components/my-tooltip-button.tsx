import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';

export function MyTooltipButton({
    variant = 'outline',
    side = 'top',
    className = '',
    children,
    size = 'default',
    title = '',
    onClick,
}: {
    variant?: 'link' | 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'myStyle' | null | undefined;
    side?:  "top" | "right" | "bottom" | "left" | undefined;
    className?: string | undefined;
    children?: React.ReactNode;
    size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
    title?: string | null | undefined;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <Button onClick={onClick} className={className} size={size} variant={variant}>
                        {children || 'Hover'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side={side}>
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
