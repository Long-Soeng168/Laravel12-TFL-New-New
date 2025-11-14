import { Link } from '@inertiajs/react';

const MyMenu = () => {
    return (
        <>
            <div className="hidden md:space-x-8 xl:flex">
                <Link href="/" className="inline-flex items-center border-b-2 border-indigo-900 px-1 pt-1 text-sm font-medium text-black">
                    About Us
                </Link>
                <Link
                    href="/solutions"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium hover:border-indigo-900 text-black"
                >
                    Solutions
                </Link>
                <Link
                    href="/case_studies"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium hover:border-indigo-900 text-black"
                >
                    Case Studies
                </Link>
                <Link
                    href="/partners"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium hover:border-indigo-900 text-black"
                >
                    Partners
                </Link>
                <Link
                    href="/careers"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium hover:border-indigo-900 text-black"
                >
                    Careers
                </Link>
                <Link
                    href="/news"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium hover:border-indigo-900 text-black"
                >
                    News
                </Link>
                <Link
                    href="/contact"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium hover:border-indigo-900 text-black"
                >
                    Contact Us
                </Link>
            </div>
        </>
    );
};

export default MyMenu;
