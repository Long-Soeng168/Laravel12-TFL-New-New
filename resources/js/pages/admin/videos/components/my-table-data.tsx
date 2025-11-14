import DeleteButton from '@/components/delete-button';
import MyImageGallery from '@/components/my-image-gallery';
import MyNoData from '@/components/my-no-data';
import { MyTooltipButton } from '@/components/my-tooltip-button';
import MyUpdateStatusButton from '@/components/my-update-status-button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import VideoDialog from '@/components/video-dialog';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowUpDown, EditIcon } from 'lucide-react';
import { useState } from 'react';
import ViewButton from './view-button';

const MyTableData = () => {
    const hasPermission = usePermission();
    const { t } = useTranslation();
    const { tableData } = usePage().props;

    const queryParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname; // Get dynamic path

    const handleSort = (fieldName: string) => {
        if (fieldName === queryParams.get('sortBy')) {
            if (queryParams.get('sortDirection') === 'asc') {
                queryParams.set('sortDirection', 'desc');
            } else {
                queryParams.set('sortDirection', 'asc');
            }
        } else {
            queryParams.set('sortBy', fieldName);
            queryParams.set('sortDirection', 'asc');
        }
        router.get(currentPath + '?' + queryParams?.toString());
    };

    const [selectedImages, setSelectedImages] = useState([]);
    const [isOpenViewImages, setIsOpenViewImages] = useState(false);
    return (
        <>
            <ScrollArea className="w-full rounded-md border">
                <MyImageGallery
                    imagePath="/assets/images/videos/"
                    selectedImages={selectedImages}
                    isOpenViewImages={isOpenViewImages}
                    setIsOpenViewImages={setIsOpenViewImages}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">{t('No')}</TableHead>
                            <TableHead className="text-left">{t('Action')}</TableHead>
                            <TableHead>{t('Image')}</TableHead>
                            <TableHead>{t('Video')}</TableHead>

                            <TableHead onClick={() => handleSort('title')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Title')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('title_kh')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Title Khmer')}
                                </span>
                            </TableHead>

                            {/* <TableHead onClick={() => handleSort('video_file')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('File Name')}
                                </span>
                            </TableHead> */}
                            <TableHead onClick={() => handleSort('playlist_code')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Playlist Code')}
                                </span>
                            </TableHead>
                            {/* <TableHead onClick={() => handleSort('name')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Playlist Name')}
                                </span>
                            </TableHead> */}

                            <TableHead onClick={() => handleSort('short_description')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Short Description')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('short_description_kh')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Short Description Khmer')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('is_free')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Status Price')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('status')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Status')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('total_view_counts')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Total View Counts')}
                                </span>
                            </TableHead>
                            <TableHead>{t('Created at')}</TableHead>
                            <TableHead>{t('Updated at')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData?.data?.map((item: any, index: number) => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        {tableData?.current_page > 1 ? tableData?.per_page * (tableData?.current_page - 1) + index + 1 : index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex h-full items-center justify-start">
                                            <ViewButton item={item} />
                                            {hasPermission('video delete') && <DeleteButton deletePath="/admin/videos/" id={item.id} />}
                                            {hasPermission('video update') && (
                                                <Link href={`/admin/videos/${item.id}/edit`}>
                                                    <MyTooltipButton title={t('Edit')} side="bottom" variant="ghost">
                                                        <EditIcon />
                                                    </MyTooltipButton>
                                                </Link>
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {item.image ? (
                                            <button
                                                onClick={() => {
                                                    setSelectedImages([{ image: item.image }]);
                                                    setIsOpenViewImages(true);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <img
                                                    src={`/assets/images/videos/thumb/` + item.image}
                                                    width={100}
                                                    height={100}
                                                    alt=""
                                                    className="size-10 object-cover transition-all duration-300 hover:scale-150"
                                                />
                                            </button>
                                        ) : (
                                            <img
                                                src={`/assets/icons/image-icon.png`}
                                                width={100}
                                                height={100}
                                                alt=""
                                                className="size-10 object-contain"
                                            />
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <span className="flex items-center justify-center">
                                            <VideoDialog videoSrc={`/assets/files/videos/${item?.video_file}`} />
                                        </span>
                                    </TableCell>
                                    <TableCell>{item.title || '---'}</TableCell>
                                    <TableCell>{item.title_kh || '---'}</TableCell>
                                    {/* <TableCell>{item.video_file || '---'}</TableCell> */}
                                    <TableCell>{item?.playlist_code || '---'}</TableCell>
                                    {/* <TableCell>{item?.playlist?.name || '---'}</TableCell> */}
                                    <TableCell>{item.short_description || '---'}</TableCell>
                                    <TableCell>{item.short_description_kh || '---'}</TableCell>
                                    <TableCell>
                                        {hasPermission('video update') ? (
                                            <MyUpdateStatusButton
                                                id={item.id}
                                                pathName="/admin/videos_free_status"
                                                currentStatus={item.is_free ? 'free' : 'subscribe'}
                                                statuses={['free', 'subscribe']}
                                            />
                                        ) : (
                                            <span className="capitalize">{item.is_free ? 'Free' : 'Subscribe'}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {hasPermission('video update') ? (
                                            <MyUpdateStatusButton
                                                id={item.id}
                                                pathName="/admin/videos"
                                                currentStatus={item.status}
                                                statuses={['active', 'inactive']}
                                            />
                                        ) : (
                                            <span className="capitalize">{item.status}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{item.total_view_counts ? `${item.total_view_counts} views` : '---'}</TableCell>
                                    <TableCell>
                                        {item.created_at
                                            ? new Date(item.created_at).toLocaleDateString('en-UK', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              })
                                            : '---'}
                                    </TableCell>
                                    <TableCell>
                                        {item.updated_at
                                            ? new Date(item.updated_at).toLocaleDateString('en-UK', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              })
                                            : '---'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {tableData?.data?.length < 1 && <MyNoData />}
        </>
    );
};

export default MyTableData;
