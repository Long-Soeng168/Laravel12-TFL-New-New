import React from 'react'
import { CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import MyProductCard from './ui/my-product-card';
import Link from 'next/link';


const products = [
    {
        id: 1,
        instock: true,
        imageUrl: '/images/new-products/1.png',
        rating: 4,
        reviews: 4,
        name: 'EX DISPLAY: MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-One...',
        price: 499.00,
        oldPrice: 599.00,
    },
    {
        id: 2,
        instock: true,
        imageUrl: '/images/new-products/2.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    {
        id: 3,
        instock: false,
        imageUrl: '/images/new-products/3.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    {
        id: 4,
        instock: true,
        imageUrl: '/images/new-products/4.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    {
        id: 5,
        instock: false,
        imageUrl: '/images/new-products/5.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    {
        id: 6,
        instock: true,
        imageUrl: '/images/new-products/6.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    {
        id: 7,
        instock: true,
        imageUrl: '/images/new-products/7.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    {
        id: 7,
        instock: false,
        imageUrl: '/images/new-products/8.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    {
        id: 7,
        instock: false,
        imageUrl: '/images/new-products/9.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    {
        id: 10,
        instock: false,
        imageUrl: '/images/new-products/10.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    {
        id: 11,
        instock: false,
        imageUrl: '/images/new-products/11.png',
        rating: 3,
        reviews: 8,
        name: 'Gaming Laptop MSI Raider GE76',
        price: 1299.00,
    },
    // Add more product objects here
];


const MyNewProduct = () => {
    return (
        <div className=''>
            <div className='flex justify-between font-semibold pt-8 px-4 md:px-2 lg:px-0'>
                <h1 className='text-xl'>New Product</h1>
                <Link href='/products'>
                    <p className='text-[12px] text-blue-500 underline'>See All New Products</p>
                </Link>
            </div>
            <div className='p-2 md:p-0'>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {products.map((product) => (
                            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6">
                                <CardContent className="flex flex-col pr-6">
                                    <MyProductCard
                                        // key={product.id} // Use a unique key here
                                        product={product}
                                    />
                                </CardContent>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:block absolute top-1/2 left-0 bg-gray-300 rounded rounded-r-full text-white border-none transform -translate-y-1/2 z-10" />
                    <CarouselNext className="hidden md:block absolute top-1/2 right-0 bg-gray-300 rounded rounded-l-full text-white border-none transform -translate-y-1/2 z-10" />
                </Carousel>
            </div>
        </div>
    )
}

export default MyNewProduct
