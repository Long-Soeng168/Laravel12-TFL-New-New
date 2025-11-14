import { MyTooltipButton } from '@/components/my-tooltip-button';
import { Link, router } from '@inertiajs/react';
import React from 'react';

interface MyProductCardProps {
    product: any;
}

const MyProductCard: React.FC<MyProductCardProps> = ({ product }) => {
    const isInStock = product.stock_status === 'instock';

    return (
        <div className="relative flex flex-col gap-5 overflow-hidden rounded-md transition-all duration-300 hover:scale-105">
            {/* Product Image */}
            <div className="group relative overflow-hidden rounded-md border-[0.5px] bg-white">
                <Link prefetch href={`/products/${product.id}`}>
                    {product.images?.length > 0 ? (
                        <img
                            width={600}
                            height={600}
                            src={`/assets/images/items/thumb/${product.images[0]?.image}`}
                            alt={product.name}
                            className="aspect-square h-full w-full object-cover"
                        />
                    ) : (
                        <img
                            width={600}
                            height={600}
                            src="/assets/icons/image-icon.png"
                            alt="Placeholder"
                            className="aspect-square h-full w-full object-cover p-8 opacity-50"
                        />
                    )}
                </Link>
                {/* <span className="absolute right-2 bottom-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <AddToCartSmall item={product} />
                </span> */}
            </div>

            <div className="relative">
                {product.shop?.name && (
                    <figcaption className="absolute -top-11 left-2 aspect-square overflow-hidden rounded-full border bg-white object-contain p-1 dark:border-white">
                        <MyTooltipButton
                            title={product.shop?.name}
                            size="icon"
                            variant="ghost"
                            onClick={() => router.get(`/shops/${product.shop?.id}`)}
                        >
                            <img
                                src={`/assets/images/shops/thumb/${product.shop?.logo}`}
                                alt=""
                                className="size-10 object-contain"
                                loading="lazy"
                                decoding="async"
                            />
                        </MyTooltipButton>
                    </figcaption>
                )}

                <Link prefetch href={`/products/${product.id}`} className="relative">
                    {/* Stock Status */}
                    {/* {product.stock_status != 'na' && (
                        <div className={`flex items-center justify-start gap-2 py-2 text-sm ${isInStock ? 'text-green-500' : 'text-red-500'}`}>
                            <Verified size={16} />

                            <p>{isInStock ? 'In Stock' : 'Out of Stock'}</p>
                        </div>
                    )} */}

                    {/* Product Name */}
                    <p className="line-clamp-3">{product.name}</p>

                    {/* Product Price */}
                    <div className="flex items-center gap-2">
                        <p className="text-md text-red-400">{parseFloat(product.price) > 0 && `$${parseFloat(product.price).toFixed(2)}`}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default MyProductCard;
