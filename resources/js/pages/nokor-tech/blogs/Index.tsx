import { MyPagination } from '@/components/my-pagination';
import { MyRefreshButton } from '@/components/my-refresh-button';
import { MySearchTableData } from '@/components/my-search-table-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import NokorTechLayout from '../layouts/nokor-tech-layout';
import { MyFilterButton } from './my-filter-button';

const Index = () => {
    const { tableData } = usePage().props;
    return (
        <NokorTechLayout>
            <div className="mx-auto max-w-screen-xl px-6 py-16 pt-6 xl:px-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
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

                <div className="mt-4 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {tableData?.data?.map((item, i) => (
                        <Link href={`/blogs/${item?.id}`} prefetch>
                            <Card key={i} className="h-full overflow-hidden rounded-md p-0 shadow-none">
                                <CardHeader className="p-0">
                                    <div className="bg-muted aspect-video w-full border-b">
                                        <img
                                            className="h-full w-full object-cover"
                                            src={`/assets/images/posts/thumb/${item?.images && item?.images[0]?.image}`}
                                            alt=""
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="flex h-full flex-col items-start justify-between pb-6">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">{item?.category?.name}</Badge>
                                            <span className="text-muted-foreground text-xs font-medium">
                                                {new Date(item?.post_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>

                                        <h3 className="mt-4 line-clamp-2 text-[1.35rem] font-semibold tracking-tight">{item?.title}</h3>
                                        <p className="text-muted-foreground mt-2 line-clamp-3">{item?.short_description}</p>
                                    </div>
                                    <button className="group relative mt-8 inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-[#394481] font-medium dark:border-[#656fe2]">
                                        <div className="inline-flex h-12 translate-y-0 items-center justify-center bg-gradient-to-r from-[#f7f8ff] to-[#ffffff] px-6 text-black transition group-hover:-translate-y-[150%] dark:from-[#070e41] dark:to-[#263381] dark:text-white">
                                            Read more <ChevronRight />
                                        </div>
                                        <div className="absolute inline-flex h-12 w-full translate-y-[100%] items-center justify-center bg-[#394481] px-6 text-neutral-50 transition duration-300 group-hover:translate-y-0 dark:bg-[#656fe2]">
                                            Read more <ChevronRight />
                                        </div>
                                    </button>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
                <MyPagination />
            </div>
        </NokorTechLayout>
    );
};

export default Index;
