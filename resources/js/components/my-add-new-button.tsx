import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

const MyAddNewButton = ({
    url,
    onClick,
    type = 'button',
}: {
    url?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    type?: 'button' | 'link';
}) => {
    const { t } = useTranslation();
    return (
        <>
            {type === 'button' ? (
                <span className="border-primary rounded-xl border p-1 transition-all duration-300 hover:m-1 hover:rounded-lg hover:border-white hover:p-0">
                    <Button onClick={onClick}>
                        <Plus />
                        {t('Add New')}
                    </Button>
                </span>
            ) : (
                <Link
                    href={url || ''}
                    className="border-primary rounded-xl border p-1 transition-all duration-300 hover:m-1 hover:rounded-lg hover:border-white hover:p-0"
                >
                    <Button>
                        <Plus />
                        {t('Add New')}
                    </Button>
                </Link>
            )}
        </>
    );
};

export default MyAddNewButton;
