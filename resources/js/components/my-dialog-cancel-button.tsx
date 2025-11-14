import useTranslation from '@/hooks/use-translation';
import { Button } from './ui/button';

const MyDialogCancelButton = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined }) => {
    const { t } = useTranslation();
    return (
        <Button className="mr-2" variant={`outline`} type="button" onClick={onClick}>
            {t('Cancel')}
        </Button>
    );
};

export default MyDialogCancelButton;
