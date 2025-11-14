import React from 'react'

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Image from 'next/image';
import MyProductCard from './ui/my-product-card';
import Link from 'next/link';


interface Product {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviews: number;
    instock: boolean;
}


interface Category {
    id: number;
    name: string;
    imageUrl: string;
}


interface MyTopProductCategoryProps {
    products: Product[];
    categories: Category[];

}

const MyTopProductCategory: React.FC<MyTopProductCategoryProps> = ({ products, categories }) => {
    return (
        <div className='mx-4 md:mx-0 md:py-4'>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent>
                    <div key={categories[0].id} className=" relative min-w-[280px] hidden md:block">
                        <Image
                            src={categories[0].imageUrl}
                            alt={categories[0].name}
                            layout="responsive"
                            width={0}
                            height={0}
                            objectFit="cover"
                            className="w-full h-full"
                        />
                        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-semibold text-3xl text-white">
                            {categories[0].name}
                        </p>
                        <Link href="#" className='cursor-pointer absolute bottom-10 text-gray-300 text-xs underline text-center left-1/2 transform -translate-x-1/2'>
                            See All Products
                        </Link>
                    </div>

                    {products.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3  md:basis-1/4 lg:basis-1/6">
                            <Card className='pl-6'>
                                <MyProductCard
                                    key={product.id}
                                   product={product}
                                />
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export default MyTopProductCategory
