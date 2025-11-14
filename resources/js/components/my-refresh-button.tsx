import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useTranslation from '@/hooks/use-translation';
import { RotateCw } from 'lucide-react';

export function MyRefreshButton() {
    const { t } = useTranslation();
    const currentPath = window.location.pathname;

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="rounded-xl border p-1">
                        <Button type="submit" variant="outline" size="icon" className="relative p-5">
                            <a href={currentPath}>
                                <RotateCw />
                            </a>
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>{t('Refresh')} {t('Page')}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
