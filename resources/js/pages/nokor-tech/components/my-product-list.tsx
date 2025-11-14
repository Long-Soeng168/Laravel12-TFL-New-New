import React from 'react';
import MyProductCard from './ui/my-product-card';

interface MyProductListProps {
    items: any;
}

const MyProductList: React.FC<MyProductListProps> = ({ items }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 p-2">
            {items?.map((item) => (
                <MyProductCard key={item.id} product={item} />
            ))}
        </div>
    );
};

export default MyProductList;
