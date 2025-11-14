import { ChevronsUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const onScroll = () => setShow(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <button
            onClick={scrollToTop}
            className={`fixed right-6 bottom-48 z-50 border p-1 bg-background/70 rounded-md shadow hover:scale-105 dark:border-foreground duration-200 cursor-pointer transition-opacity sm:bottom-32 ${show ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
            <ChevronsUpIcon size={34} />
        </button>
    );
}
