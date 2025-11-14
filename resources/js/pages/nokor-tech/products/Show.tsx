import useTranslation from '@/hooks/use-translation';
import { Head, Link, usePage } from '@inertiajs/react';
import AddToCart from '../components/add-to-cart';
import CarouselWithThumbs from '../components/CarouselWithThumbs';
import MyProductList from '../components/my-product-list';
import MyProductListHeader from '../components/my-product-list-header';
import NokorTechLayout from '../layouts/nokor-tech-layout';
const ProductDetailPage = () => {
    const { itemShow, relatedItems } = usePage().props;
    const { t } = useTranslation();
    return (
        <NokorTechLayout>
            <Head>
                <title>{itemShow?.name}</title>
                <meta name="description" content={itemShow?.short_description} />
            </Head>

            <div>
                <div className="mx-auto max-w-screen-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Product Image */}
                        {itemShow?.images?.length > 0 && (
                            <div className="flex flex-col items-center px-4 py-4 md:w-[40%]">
                                <CarouselWithThumbs images={itemShow?.images || []} />
                            </div>
                        )}

                        {/* Product Details */}
                        <div className="p-6 md:w-1/2">
                            <h1 className="text-foreground text-2xl font-bold md:text-3xl">{itemShow?.name}</h1>
                            {itemShow?.brand?.name && (
                                <p className="text-foreground mt-2 text-base">
                                    {t('Brand')}:{' '}
                                    <Link className="text-primary hover:underline" href={`/products?brand_code=${itemShow?.brand?.code}`}>
                                        {itemShow?.brand?.name}
                                    </Link>
                                </p>
                            )}
                            {itemShow?.category?.name && (
                                <p className="text-foreground mt-2 text-base">
                                    {t('Category')}:{' '}
                                    <Link className="text-primary hover:underline" href={`/products?category_code=${itemShow?.category?.code}`}>
                                        {itemShow?.category?.name}
                                    </Link>
                                </p>
                            )}
                            {itemShow?.code && (
                                <p className="text-foreground mt-2 text-base">
                                    {t('Product Code')}: {itemShow?.code}
                                </p>
                            )}

                            {itemShow?.colors_with_details?.length > 0 && (
                                <div className="mt-4">
                                    <p>{t('Colors Available')}</p>

                                    <div className="my-1 flex flex-wrap gap-2">
                                        {itemShow?.colors_with_details?.map((item: any) => {
                                            return (
                                                <div
                                                    key={item.code}
                                                    className={`flex cursor-pointer items-center gap-4 rounded border px-3 py-2 transition`}
                                                >
                                                    <div
                                                        className="flex h-4 w-4 items-center justify-center rounded border border-gray-300"
                                                        style={{ backgroundColor: item.code }}
                                                    ></div>

                                                    <span className="text-sm">{item.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {itemShow?.sizes_with_details?.length > 0 && (
                                <div className="mt-4">
                                    <p>{t('Sizes Available')}</p>

                                    <div className="my-1 flex flex-wrap gap-2">
                                        {itemShow?.sizes_with_details?.map((item: any) => {
                                            return (
                                                <div
                                                    key={item.code}
                                                    className={`flex cursor-pointer items-center gap-4 rounded border px-3 py-2 transition`}
                                                >
                                                    <span className="text-sm">{item.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 mb-4">
                                <p className="text-2xl font-bold text-red-600">${itemShow?.price}</p>
                            </div>

                            <AddToCart item={itemShow} />

                            {itemShow.shop?.id && (
                                <Link href={`/shops/${itemShow.shop?.id}`} className="hover:bg-muted mt-8 block cursor-pointer rounded-md p-2">
                                    <figcaption className="flex items-center space-x-4">
                                        <img
                                            src={`/assets/images/shops/thumb/${itemShow.shop?.logo}`}
                                            alt=""
                                            className="h-14 w-14 flex-none rounded-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="flex-auto">
                                            <div className="text-base font-semibold text-slate-900 dark:text-slate-200">{itemShow.shop?.name}</div>
                                            <div className="mt-0.5 dark:text-slate-300">{itemShow.shop?.address}</div>
                                            {/* <div className="mt-0.5 dark:text-slate-300">{itemShow.shop?.phone}</div> */}
                                        </div>
                                    </figcaption>
                                </Link>
                            )}

                            {itemShow?.short_description && (
                                <div>
                                    <hr className="my-8" />
                                    <p className="text-foreground mb-2 text-lg font-semibold">{t('Description')}:</p>
                                    <div className="whitespace-pre-line">{itemShow?.short_description}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {relatedItems?.length > 0 && (
                        <div className="my-20">
                            <MyProductListHeader title="Related" link={`/products?category_code=${itemShow?.category_code}`} />
                            <MyProductList items={relatedItems} />
                        </div>
                    )}
                </div>
            </div>
        </NokorTechLayout>
    );
};

export default ProductDetailPage;
