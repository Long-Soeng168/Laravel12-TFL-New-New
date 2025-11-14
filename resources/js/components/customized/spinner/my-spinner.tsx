import { LoaderIcon } from 'lucide-react';

export default function MySpinner() {
    return (
        <span className='flex gap-2 animate-pulse'>
            <LoaderIcon className="animate-spin" />
            Loading...
        </span>
    );
}
