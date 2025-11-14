import MyNoData from '@/components/my-no-data';
import { Separator } from '@/components/ui/separator';
import useTranslation from '@/hooks/use-translation';
import { Head, usePage, WhenVisible } from '@inertiajs/react';
import { ChevronUpIcon } from 'lucide-react';
import MyCategoryList from '../components/my-category-list';
import SortBy from '../components/sort-by';
import MyProductCard from '../components/ui/my-product-card';
import NokorTechLayout from '../layouts/nokor-tech-layout';
import BrandList from './components/BrandList';
import { BreadcrumbComponent } from './components/BreadcrumbComponent';
import SkeletonProductList from './components/SkeletonProductList';
import SubCategoryList from './components/SubCategoryList';

const Index = () => {
    const { tableData, selected_category, item_categories, sub_categories, category_brands, page, next_page_url } = usePage().props;
    const { url } = usePage();

    const urlCleanPage = (() => {
        const [path, query] = url.split('?');
        if (!query) return url;

        const params = new URLSearchParams(query);
        params.delete('page');

        const newQuery = params.toString();
        return newQuery ? `${path}?${newQuery}` : path;
    })();

    const { t, currentLocale } = useTranslation();
    return (
        <NokorTechLayout>
            <Head>
                <title>Products | PG Market - Cambodia's Digital Marketplace</title>
                <meta
                    name="description"
                    content="Explore a wide range of products on PG Market, Cambodia's trusted digital marketplace. Buy and sell goods easily and securely online."
                />
            </Head>

            <div className="bg-secondary py-4">
                <div className="mx-auto mb-8 max-w-screen-xl">
                    <BreadcrumbComponent />
                    <div className="bg-background mt-4 rounded-lg border p-4">
                        {/* Top Category Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h1 className="text-foreground text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
                                {selected_category?.name ? (
                                    <>{currentLocale == 'kh' ? selected_category?.name_kh || selected_category?.name : selected_category?.name}</>
                                ) : (
                                    t('All Categories')
                                )}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 md:ml-4">
                                {/* <MyRefreshButton /> */}
                                <SortBy />
                            </div>
                        </div>
                        {/* Sub Categories */}
                        {selected_category?.name ? (
                            <>
                                {sub_categories?.length > 0 && <SubCategoryList items={sub_categories} />}

                                {sub_categories?.length > 0 && category_brands.length > 0 && <Separator className="my-4" />}

                                {category_brands?.length > 0 && <BrandList items={category_brands} />}
                            </>
                        ) : (
                            <MyCategoryList items={item_categories} />
                        )}
                    </div>

                    <div className="mt-10 flex">
                        {/* start right side */}
                        {/* start fillter products section */}
                        <div className="flex-1">
                            {/* end fillter products section */}
                            <div className="flex-1 px-4 min-xl:px-0">
                                {/* start list products */}
                                <div>{tableData?.length == 0 && <MyNoData />}</div>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {tableData?.map((product) => <MyProductCard key={product.id} product={product} />)}
                                </div>
                                <>
                                    {next_page_url ? (
                                        <WhenVisible
                                            always
                                            params={{
                                                data: {
                                                    page: +page + 1,
                                                },
                                                only: ['tableData', 'page', 'next_page_url'],
                                            }}
                                            fallback={<SkeletonProductList />}
                                        >
                                            <SkeletonProductList />
                                        </WhenVisible>
                                    ) : (
                                        tableData?.length > 0 && (
                                            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10">
                                                <p className="text-lg font-medium">{t("You have reached the end.")}</p>
                                                <a
                                                    href={`${urlCleanPage}`}
                                                    className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-primary-foreground transition-all"
                                                >
                                                    <ChevronUpIcon /> {t("Start Scroll Again")}
                                                </a>
                                            </div>
                                        )
                                    )}
                                </>

                                {/* end list products */}
                                {/* start pagination */}
                                <div className="my-16 flex justify-center">{/* <MyPagination /> */}</div>
                                {/* end pagination */}
                            </div>
                            {/* end right side */}
                        </div>
                    </div>

                    {/* end list products */}
                </div>
            </div>
        </NokorTechLayout>
    );
};

export default Index;
