import MyNoData from '@/components/my-no-data';
import { MyPagination } from '@/components/my-pagination';
import { MyRefreshButton } from '@/components/my-refresh-button';
import { MySearchTableData } from '@/components/my-search-table-data';
import { usePage } from '@inertiajs/react';
import SortBy from '../components/sort-by';
import MyProductCard from '../components/ui/my-product-card';
import NokorTechLayout from '../layouts/nokor-tech-layout';
import ShopProfileHeader from './components/ShopProfileHeader';

const Show = () => {
    const { tableData, shop } = usePage().props;
    return (
        <NokorTechLayout>
            <div className="mx-auto mb-8 max-w-screen-xl">
                <ShopProfileHeader shop={shop} />

                <div className="flex">
                    {/* start left side */}
                    {/* <div className="hidden w-64 lg:block">
                        <Filters />
                        <div className="mt-8 flex w-full flex-col gap-0.5">
                            {productListBanners?.length > 0 &&
                                productListBanners?.map((banner) => (
                                    <Link href={banner?.link ? banner.link : '#'} prefetch>
                                        <img
                                            className="h-auto w-full transition-all duration-300 hover:scale-95"
                                            src={`/assets/images/banners/thumb/${banner?.image}`}
                                            alt=""
                                            width={600}
                                            height={600}
                                        />
                                    </Link>
                                ))}
                        </div>
                    </div> */}
                    {/* end left side */}

                    {/* start right side */}
                    {/* start fillter products section */}
                    <div className="flex-1">
                        <div className="mb-4 flex flex-wrap items-center justify-end gap-4 px-4">
                            <div className="w-full md:flex-1">
                                <MySearchTableData className="max-w-full" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:ml-4">
                                <MyRefreshButton />
                                <SortBy />
                                {/* <div className="lg:hidden">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <div className="rounded-xl border p-1">
                                                <Button type="submit" variant="outline" size="icon" className="relative p-5">
                                                    <FilterIcon />
                                                </Button>
                                            </div>
                                        </SheetTrigger>
                                        <SheetContent side="left">
                                            <SheetHeader className="hidden">
                                                <SheetTitle></SheetTitle>
                                                <SheetDescription></SheetDescription>
                                            </SheetHeader>
                                            <Filters />
                                        </SheetContent>
                                    </Sheet>
                                </div> */}
                            </div>
                        </div>
                        {/* end fillter products section */}
                        <div className="flex-1 px-4">
                            {/* start list products */}
                            <div>{tableData?.data?.length == 0 && <MyNoData />}</div>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {tableData?.data?.map((product) => <MyProductCard key={product.id} product={product} />)}
                            </div>
                            {/* end list products */}
                            {/* start pagination */}
                            <div className="my-16 flex justify-center">
                                <MyPagination />
                            </div>
                            {/* end pagination */}
                        </div>
                        {/* end right side */}
                    </div>
                </div>
                {/* end list products */}
            </div>
        </NokorTechLayout>
    );
};

export default Show;
