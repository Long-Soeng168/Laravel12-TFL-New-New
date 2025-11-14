import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import AddToCart from '../components/add-to-cart';
import NokorTechLayout from '../layouts/nokor-tech-layout';

const Show = () => {
    const { currentLocale } = useTranslation();
    const { videoPlaylist, relatedPosts, postCategories } = usePage().props;
    return (
        <NokorTechLayout>
            <div className="mx-auto flex max-w-4xl flex-col items-start gap-12 px-6 py-6 lg:flex-row lg:py-8 xl:px-0">
                <div>
                    <h3 className="line-clamp-2 py-4 text-4xl font-semibold">{videoPlaylist?.name}</h3>
                    {/* <img
                        className="mb-4 h-full max-h-[600px] w-full rounded-xl object-cover"
                        src={`/assets/images/video_play_lists/${videoPlaylist?.image}`}
                        alt=""
                    /> */}
                    <div className="prose ck-content max-w-none whitespace-pre-line text-foreground">
                        <div dangerouslySetInnerHTML={{ __html: videoPlaylist?.short_description }} />
                    </div>
                    <div className="my-8">
                        <AddToCart item={videoPlaylist} />
                    </div>

                    <h2 className="mt-20 text-3xl font-bold">Videos</h2>

                    <div className="mt-4 space-y-12">
                        {relatedPosts?.map((item, i) => (
                            <Link href={`/blogs/${item?.id}`}>
                                <Card
                                    key={i}
                                    className="flex flex-col overflow-hidden rounded-md border-none shadow-none sm:flex-row sm:items-center"
                                >
                                    <CardHeader className="px-0 sm:p-0">
                                        <div className="bg-muted aspect-video rounded-lg sm:w-64">
                                            <img
                                                className="h-full max-h-[600px] w-full rounded-md object-cover"
                                                src={`/assets/images/posts/thumb/${item?.images && item?.images[0]?.image}`}
                                                alt=""
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-col px-0 py-0 sm:px-4">
                                        <h3 className="line-clamp-2 text-2xl font-semibold">{item?.title}</h3>
                                        <p className="text-muted-foreground mt-2 line-clamp-3 text-ellipsis">{item?.short_description}</p>
                                        <div className="flex items-center gap-6 py-2">
                                            <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">{item?.category?.name}</Badge>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(item?.post_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
                {/* <aside className="sticky top-8 w-full shrink-0 lg:max-w-sm">
                    <h3 className="text-3xl font-bold">Categories</h3>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
                        {postCategories?.map((category) => (
                            <Link
                                href={`/blogs?category_code=${category?.code}`}
                                key={category?.name}
                                className={cn(
                                    'bg-primary/5 hover:bg-primary/10 flex cursor-pointer items-center justify-between gap-2 rounded-md p-3',
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <img className="size-6" src={`/assets/images/post_categories/thumb/${category?.image}`} />
                                    <span className="font-medium">{category?.name}</span>
                                </div>
                                <Badge className="min-h-6 min-w-6 rounded-full px-1.5">{category?.posts_count}</Badge>
                            </Link>
                        ))}
                    </div>
                </aside> */}
            </div>
        </NokorTechLayout>
    );
};

export default Show;
