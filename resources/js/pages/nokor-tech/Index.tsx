import MyNoData from '@/components/my-no-data';
import { Head, usePage } from '@inertiajs/react';
import MyBlogList from './components/my-blogs-list';
import MyCategoryList from './components/my-category-list';
import MyMiddleSlide from './components/my-middle-slide';
import MyProductList from './components/my-product-list';
import MyProductListHeader from './components/my-product-list-header';
import MySlide from './components/my-slide';
import { SeeMoreProducts } from './components/see-more-products';
import NokorTechLayout from './layouts/nokor-tech-layout';

const Index = () => {
    const { topBanners, middleBanners, posts, newArrivalsProducts, products, item_categories } = usePage<any>().props;
    return (
        <NokorTechLayout>
            <Head>
                <title>Cambodia's Digital Marketplace</title>
                <meta
                    name="description"
                    content="PG Market is Cambodia's trusted digital marketplace platform, connecting buyers and sellers nationwide with ease, speed, and transparency."
                />
            </Head>

            <div className="mx-auto mb-10 max-w-[2000px]">
                {topBanners?.length > 0 && <MySlide slides={topBanners} path="/assets/images/banners/thumb/" />}
            </div>
            <main className="px-2">
                <>
                    <div className="mx-auto mb-10 max-w-screen-xl">
                        {/* end slide */}
                        <div className="mt-10 mb-4 space-y-4">{item_categories?.length > 0 && <MyCategoryList items={item_categories} />}</div>

                        {products?.length > 0 ? (
                            <>
                                <MyProductListHeader title="Products" link="/products" />
                                <MyProductList items={products} />
                            </>
                        ) : (
                            <MyNoData />
                        )}

                        {middleBanners?.length > 0 && <MyMiddleSlide slides={middleBanners} path="/assets/images/banners/thumb/" />}

                        {newArrivalsProducts?.length > 0 ? (
                            <>
                                <MyProductListHeader title="Latest Products" link="/products" />
                                <MyProductList items={newArrivalsProducts} />
                            </>
                        ) : (
                            <MyNoData />
                        )}

                        <div className="my-10 flex justify-center">
                            <SeeMoreProducts />
                        </div>

                        {posts?.length > 0 && (
                            <>
                                <MyProductListHeader title="Blogs" />
                                <MyBlogList posts={posts} />
                            </>
                        )}

                        <div className="h-20"></div>
                    </div>
                    {/* <MyService /> */}
                </>
            </main>
        </NokorTechLayout>
    );
};

export default Index;
