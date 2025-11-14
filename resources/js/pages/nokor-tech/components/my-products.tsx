import React from 'react'
import MyTopProductCategory from './my_top_product_category';
import MyProductCategory from './my_product_category';
import BrandLogos from './BrandLogosProps ';
import FeedbackList from './FeedbackCard';

const Products = () => {


    const productstop = [
        {
            id: 1,
            name: "EX DISPLAY : MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-One",
            imageUrl: "/images/new-products/1.png",
            price: 499.00,
            oldPrice: 599.00,
            rating: 3,
            reviews: 4,
            instock: true,
        },
        {
            id: 2,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/2.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 3,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/3.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        {
            id: 4,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/4.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        {
            id: 5,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/4.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 6,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/4.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 7,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/4.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        // Add more product objects as needed
    ];
    const productstop1 = [
        {
            id: 1,
            name: "EX DISPLAY : MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-One",
            imageUrl: "/images/new-products/1.png",
            price: 499.00,
            oldPrice: 599.00,
            rating: 3,
            reviews: 4,
            instock: false,
        },
        {
            id: 2,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/2.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 3,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/3.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        {
            id: 4,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/4.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        {
            id: 5,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/4.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 6,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/4.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        // Add more product objects as needed
    ];
    const products = [
        {
            id: 1,
            name: "EX DISPLAY : MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-One",
            imageUrl: "/images/new-products/2.png",
            price: 499.00,
            oldPrice: 599.00,
            rating: 3,
            reviews: 4,
            instock: true,
        },
        {
            id: 2,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/4.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 3,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/3.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        {
            id: 4,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/1.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 5,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/1.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        {
            id: 6,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/1.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        // Add more product objects as needed
    ];
    const products1 = [
        {
            id: 1,
            name: "EX DISPLAY : MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-One",
            imageUrl: "/images/new-products/2.png",
            price: 499.00,
            oldPrice: 599.00,
            rating: 3,
            reviews: 4,
            instock: true,
        },
        {
            id: 2,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/4.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 3,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/3.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: true,
        },
        {
            id: 4,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/1.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 5,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/1.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 6,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/1.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        {
            id: 7,
            name: "High Performance Laptop - Intel Core i7",
            imageUrl: "/images/new-products/1.png",
            price: 899.00,
            oldPrice: 50,
            rating: 5,
            reviews: 10,
            instock: false,
        },
        
        // Add more product objects as needed
    ];

    const series = [
        { title: 'MSI GE Series', isActive: true },
        { title: 'MSI GT Series', isActive: false },
        { title: 'MSI GL Series', isActive: false },
        { title: 'MSI GS Series', isActive: false },
    ];
    const series1 = [
        { title: 'MSI Infinute Series', isActive: true },
        { title: 'MSI Triden', isActive: false },
        { title: 'MSI GL Series', isActive: false },
        { title: 'MSI Nightblade', isActive: false },
    ];

    const category = [
        { id: 1, name: 'MSI Laptops', imageUrl: '/images/products/custome_build.png' },
    ]

    const category1 = [
        { id: 1, name: 'Destops', imageUrl: '/images/products/custome_build.png' },
    ]

    const categorytop = [
        { id: 1, name: 'Custome Builds', imageUrl: '/images/products/custome_build.png' },
    ]
    const categorytop1 = [
        { id: 1, name: 'Gaming Monitors', imageUrl: '/images/products/custome_build.png' },
    ]

    const logos = [
        { src: '/images/logo/brand/1.png', alt: 'Brand 1' },
        { src: '/images/logo/brand/2.png', alt: 'Brand 2' },
        { src: '/images/logo/brand/3.png', alt: 'Brand 3' },
        { src: '/images/logo/brand/4.png', alt: 'Brand 4' },
        { src: '/images/logo/brand/5.png', alt: 'Brand 5' },
        { src: '/images/logo/brand/6.png', alt: 'Brand 6' },
        { src: '/images/logo/brand/7.png', alt: 'Brand 7' },
    ];

    const feedbacks = [
        {
            id: 1,
            image: '/images/feedback/1.png',
            text: 'If you’ve recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...',
            date: '01.09.2020',
        },
        {
            id: 2,
            image: '/images/feedback/1.png',
            text: 'If you’ve recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...',
            date: '01.09.2020',
        },
        {
            id: 3,
            image: '/images/feedback/1.png',
            text: 'If you’ve recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...',
            date: '01.09.2020',
        },
        {
            id: 4,
            image: '/images/feedback/1.png',
            text: 'If you’ve recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...',
            date: '01.09.2020',
        },
        {
            id: 5,
            image: '/images/feedback/1.png',
            text: 'If you’ve recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...',
            date: '01.09.2020',
        },
        {
            id: 6,
            image: '/images/feedback/1.png',
            text: 'If you’ve recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...',
            date: '01.09.2020',
        },
        {
            id: 7,
            image: '/images/feedback/1.png',
            text: 'If you’ve recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...',
            date: '01.09.2020',
        },
        // Add more feedback items here
    ];

    return (
        <div>
            <div className=" m-4 md:m-0 flex gap-1 flex-col md:flex-row items-center justify-center bg-blue-100 py-4">
                <img src="/images/logo/zip.png" alt="" className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32" />
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                    <span className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">own</span>
                    <span className="text-blue-400 px-2 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">|</span>
                    it now, up to 6 months interest free
                </p>
                <span className="text-sm md:text-base lg:text-base xl:text-sm underline">learn more</span>
            </div>

            {/* start top product category */}
            <MyTopProductCategory products={productstop} categories={categorytop} />
            {/* end top product category */}

            {/* start  product category */}
            <MyProductCategory products={products} series={series} categories={category} />
            <MyProductCategory products={products1} series={series1} categories={category1} />
            <MyTopProductCategory products={productstop1} categories={categorytop1} />
            {/* end  product category */}

            {/* start brand logo */}
            <BrandLogos logos={logos}
                className='mx-8 md:mx-0 flex flex-wrap gap-y-8 md:gap-x-16 justify-evenly items-center py-16'
            />
            {/* end brand logo */}

            {/* start Follow us on Instagram for News, Offers & More */}

            <FeedbackList feedbacks={feedbacks} />
            {/* end Follow us on Instagram for News, Offers & More */}

        </div>
    )
}

export default Products
