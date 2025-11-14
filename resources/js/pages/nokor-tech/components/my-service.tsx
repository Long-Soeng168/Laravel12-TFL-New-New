import { Phone, Truck, RefreshCcw } from 'lucide-react';

export default function MyFeature() {
    return (
        <div className="flex flex-wrap justify-evenly my-16">
            <div className="flex flex-col items-center text-center py-4 w-48 sm:w-64">
                <div className="flex items-center justify-center bg-primary p-3 sm:p-4 w-14 h-14 rounded-full">
                    <Phone className="text-white" />
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold py-4">Product Support</p>
                <p className="text-sm sm:text-base text-gray-500 px-2">Up to 3 years on-site warranty available for your peace of mind.</p>
            </div>

            <div className="flex flex-col items-center text-center py-4 w-48 sm:w-64">
                <div className="flex items-center justify-center bg-primary p-3 sm:p-4 w-14 h-14 rounded-full">
                    <Truck className="text-white" />
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold py-4">Fast Delivery</p>
                <p className="text-sm sm:text-base text-gray-500 px-2">Get your products delivered within 24 hours in select cities.</p>
            </div>

            <div className="flex flex-col items-center text-center py-4 w-48 sm:w-64">
                <div className="flex items-center justify-center bg-primary p-3 sm:p-4 w-14 h-14 rounded-full">
                    <RefreshCcw className="text-white" />
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold py-4">Easy Returns</p>
                <p className="text-sm sm:text-base text-gray-500 px-2">Hassle-free returns within 30 days for your convenience.</p>
            </div>
        </div>
    );
}
