import { XIcon } from 'lucide-react';
import { Button } from './ui/button';

const MyDialogCloseButton = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined }) => {
    return (
        <Button
            className={`absolute top-4 right-4 z-50 border-red-500 text-red-500 hover:text-red-600`}
            variant={`outline`}
            size={`icon`}
            type='button'
            onClick={onClick}
        >
            <XIcon />
        </Button>
    );
};

export default MyDialogCloseButton;
