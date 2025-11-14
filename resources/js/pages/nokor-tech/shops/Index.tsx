import MyNoData from '@/components/my-no-data';
import { MyPagination } from '@/components/my-pagination';
import { MyRefreshButton } from '@/components/my-refresh-button';
import { MySearchTableData } from '@/components/my-search-table-data';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ShopCategories from '@/pages/admin/shops/components/shop-categories';
import { usePage } from '@inertiajs/react';
import { FilterIcon } from 'lucide-react';
import MyShopCard from '../components/ui/my-shop-card';
import NokorTechLayout from '../layouts/nokor-tech-layout';
import SortBy from './components/sort-by';

const Index = () => {
    const { tableData } = usePage().props;
    return (
        <NokorTechLayout>
            <div className="mx-auto mb-8 max-w-screen-xl">
                <div className="my-4 flex flex-wrap items-center justify-end gap-4 px-4">
                    <div className="flex w-full items-center flex-wrap gap-2 md:flex-1">
                        <div className='p-1 border rounded-[12px] w-[200px]'>
                            <ShopCategories />
                        </div>
                        <MySearchTableData placholder="Search Shops" className="flex-1 fmax-w-full" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:ml-20">
                        <MyRefreshButton />
                        <SortBy />
                        <div className="lg:hidden">
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
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
                {/* end fillter products section */}
                <div className="flex-1 px-4">
                    {/* start list products */}
                    <div>{tableData?.data?.length == 0 && <MyNoData />}</div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                        {tableData?.data?.map((shop) => <MyShopCard key={shop.id} shop={shop} />)}
                    </div>
                    {/* end list products */}
                    {/* start pagination */}
                    <div className="my-16 flex justify-center">
                        <MyPagination />
                    </div>
                    {/* end pagination */}
                </div>
            </div>
        </NokorTechLayout>
    );
};

export default Index;
