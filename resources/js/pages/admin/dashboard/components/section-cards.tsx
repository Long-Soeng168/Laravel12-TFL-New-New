import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { AppWindowIcon, FilePenLineIcon, GalleryThumbnailsIcon, Heading1Icon, LinkIcon, ListCheckIcon, ListTodoIcon, ProjectorIcon, ShieldCheckIcon, UsersIcon, Waypoints } from 'lucide-react';

const SectionCards = () => {
    const hasPermission = usePermission();
    const { t, currentLocale } = useTranslation();
    const { featureDatas } = usePage().props;
    const features = [
        {
            icon: ListTodoIcon,
            title: t('Items'),
            total_records: `${featureDatas?.item_counts}`,
            // sub_total_records: `Total view : ${featureDatas?.totalPostViews}`,
            link: '/admin/items',
            permission: 'item view',
        },
        {
            icon: FilePenLineIcon,
            title: t('Posts'),
            total_records: `${featureDatas?.post_counts}`,
            // sub_total_records: `Total view : ${featureDatas?.totalPostViews}`,
            link: '/admin/posts',
            permission: 'post view',
        },
        {
            icon: AppWindowIcon,
            title: t('Pages'),
            total_records: `${featureDatas?.page_counts}`,
            link: '/admin/pages',
            permission: 'page view',
        },
        {
            icon: ProjectorIcon,
            title: t('Projects'),
            total_records: `${featureDatas?.project_counts}`,
            link: '/admin/projects',
            permission: 'project view',
        },
        {
            icon: LinkIcon,
            title: t('Links'),
            total_records: `${featureDatas?.link_counts}`,
            link: '/admin/links',
            permission: 'link view',
        },
        {
            icon: GalleryThumbnailsIcon,
            title: t('Banners'),
            total_records: `${featureDatas?.banner_counts}`,
            link: '/admin/banners',
            permission: 'banner view',
        },
        {
            icon: Heading1Icon,
            title: t('Headings'),
            total_records: `${featureDatas?.heading_counts}`,
            link: '/admin/headings',
            permission: 'heading view',
        },
        {
            icon: UsersIcon,
            title: t('Users'),
            total_records: `${featureDatas?.user_counts}`,
            link: '/admin/users',
            permission: 'user view',
        },
        {
            icon: Waypoints,
            title: t('Roles'),
            total_records: `${featureDatas?.role_counts}`,
            link: '/admin/roles',
            permission: 'role view',
        },
        {
            icon: ShieldCheckIcon,
            title: t('Permissions'),
            total_records: `${featureDatas?.permission_counts}`,
            link: '/admin/permissions',
            permission: 'permission view',
        },
    ];

    return (
        <div>
            <div className="mx-auto grid max-w-full gap-6 px-6 sm:grid-cols-2 xl:grid-cols-4">
                {features.map((feature) =>
                    hasPermission(feature.permission) ? (
                        <Link
                            prefetch
                            href={feature.link}
                            key={feature.title + feature.link}
                            className="flex flex-row items-center justify-between rounded-xl border border-primary/20 px-5 py-6 transition-all duration-300 hover:-translate-1.5 hover:rounded hover:shadow-[5px_5px_rgba(104,_96,_255,_0.4),_10px_10px_rgba(104,_96,_255,_0.3),_15px_15px_rgba(104,_96,_255,_0.2),_20px_20px_rgba(104,_96,_255,_0.1),_25px_25px_rgba(104,_96,_255,_0.05)]"
                        >
                            <div className="bg-primary/10 flex aspect-square h-16 items-center justify-center rounded-full">
                                <feature.icon className="stroke-primary aspect-square size-7 object-contain" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-lg ${currentLocale == 'kh' ? 'font-koulen-regular' : 'font-bold'}`}>{feature.title}</span>
                                <p className="text-foreground/80 mt-1 text-[15px]">
                                    <strong>{feature.total_records}</strong> {feature.title}
                                </p>
                                {feature.sub_total_records && <p className="text-foreground/80 mt-1 text-[15px]">{feature.sub_total_records}</p>}
                            </div>
                        </Link>
                    ) : null,
                )}
            </div>
        </div>
    );
};

export default SectionCards;
