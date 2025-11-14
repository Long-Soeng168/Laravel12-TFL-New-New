import { SkeletonProductCard } from '@/components/skeleton-product-card';

const SkeletonProductList = () => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-4">
            <SkeletonProductCard />
            <SkeletonProductCard />
            <SkeletonProductCard />
            <SkeletonProductCard />
            <SkeletonProductCard />
        </div>
    );
};

export default SkeletonProductList;
