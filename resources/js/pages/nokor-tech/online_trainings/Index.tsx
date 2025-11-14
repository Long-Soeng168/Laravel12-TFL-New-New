import MyNoData from '@/components/my-no-data';
import { MyPagination } from '@/components/my-pagination';
import { MyRefreshButton } from '@/components/my-refresh-button';
import { MySearchTableData } from '@/components/my-search-table-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import AddToCart from '../components/add-to-cart';
import NokorTechLayout from '../layouts/nokor-tech-layout';
import { MyFilterButton } from './my-filter-button';

const Index = () => {
    const { tableData } = usePage().props;
    return (
        <NokorTechLayout>
            <div className="mx-auto max-w-screen-xl px-6 py-16 pt-6 xl:px-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-3xl font-bold tracking-tight">Online Training</h2>
                    <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
                        <div className="relative block w-full md:flex-1">
                            {/* <Search className="absolute inset-y-0 left-2.5 my-auto h-5 w-5" />
                            <Input
                                className="w-full flex-1 rounded border-none bg-slate-100/70 pl-10 shadow-none md:w-[280px] dark:bg-slate-800"
                                placeholder="Search"
                            /> */}
                            <MySearchTableData />
                        </div>
                        <MyRefreshButton />
                        <MyFilterButton />

                        {/* <Select defaultValue="recommended">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recommended">Recommended</SelectItem>
                                <SelectItem value="latest">Latest</SelectItem>
                                <SelectItem value="popular">Popular</SelectItem>
                            </SelectContent>
                        </Select> */}
                    </div>
                </div>

                {!(tableData?.data?.length > 0) && <MyNoData />}

                <div className="mt-4 grid gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                    {tableData?.data?.map((item, i) => (
                        <Card key={i} className="h-full overflow-hidden rounded-md p-0 shadow-none">
                            <CardHeader className="p-0">
                                <div className="group bg-muted relative aspect-video w-full overflow-hidden border-b">
                                    {/* <Link href={`/online_trainings/${item?.id}`} prefetch> */}
                                    <img
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        src={`/assets/images/video_play_lists/thumb/${item?.image}`}
                                        alt=""
                                    />

                                    {/* Overlay on hover */}
                                    {/* <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div> */}
                                    {/* </Link> */}

                                    {/* AddToCart button with fade + slide effect */}
                                    {/* <div className="absolute right-2 bottom-2 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                        <AddToCart item={item} />
                                    </div> */}
                                </div>
                            </CardHeader>

                            <CardContent className="flex h-full flex-col items-start justify-between">
                                <Badge variant="outline" className="text-primary mb-2 text-base">
                                    {item?.videos_count} videos
                                </Badge>

                                {/* <Link href={`/online_trainings/${item?.id}`} prefetch> */}
                                <div>
                                    <h3 className="line-clamp-2 pt-2 text-[1.35rem] leading-8 underline-offset-4">{item?.name}</h3>
                                    <p className="text-muted-foreground mt-2 line-clamp-3 leading-7 underline-offset-4">{item?.short_description}</p>
                                </div>
                                {/* </Link> */}

                                <div className="my-6 flex w-full justify-end">
                                    <AddToCart item={item} />
                                </div>
                            </CardContent>
                            {/* <div className="flex w-full justify-end p-2">
                                <Link href={`/online_trainings/${item?.id}`} prefetch>
                                    <Button variant="link">
                                        More Detail <ChevronRight />
                                    </Button>
                                </Link>
                            </div> */}
                        </Card>
                    ))}
                </div>
                <MyPagination />
            </div>
        </NokorTechLayout>
    );
};

export default Index;
