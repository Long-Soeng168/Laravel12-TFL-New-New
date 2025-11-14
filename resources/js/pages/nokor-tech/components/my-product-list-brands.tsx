import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import MyProductList from './my-product-list';

const MyProductListBrands = () => {
    return (
        <div className="mt-20">
            <div className="border-primary mx-2 mb-2 flex items-center justify-between border-b">
                <ul className="flex flex-wrap gap-x-1 text-sm font-semibold text-gray-400 md:text-xl">
                    <li className="bg-primary cursor-pointer px-4 py-1 text-white transition-all duration-300">ASUS</li>
                    <li className="hover:bg-primary cursor-pointer px-4 py-1 transition-all duration-300 hover:text-white">MSI</li>
                    <li className="hover:bg-primary cursor-pointer px-4 py-1 transition-all duration-300 hover:text-white">DELL</li>
                </ul>
                <Link href="/products">
                    <p className="text-md text-primary flex items-center gap-2 underline-offset-2 transition-all duration-300 hover:translate-x-2 hover:underline">
                        See More <ChevronRight size={24} />
                    </p>
                </Link>
            </div>
            <MyProductList />
        </div>
    );
};

export default MyProductListBrands;
