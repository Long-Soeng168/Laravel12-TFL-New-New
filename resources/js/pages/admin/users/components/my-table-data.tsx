import DeleteButton from '@/components/delete-button';
import MyImageGallery from '@/components/my-image-gallery';
import MyNoData from '@/components/my-no-data';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import EditButton from './edit-button';
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
                    imagePath="/assets/images/users/"
                    selectedImages={selectedImages}
                    isOpenViewImages={isOpenViewImages}
                    setIsOpenViewImages={setIsOpenViewImages}
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">{t('ID')}</TableHead>
                            <TableHead className="text-left">{t('Action')}</TableHead>
                            <TableHead>{t('Image')}</TableHead>
                            <TableHead onClick={() => handleSort('name')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Name')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('email')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Email')}
                                </span>
                            </TableHead>
                            <TableHead>{t('Role')}</TableHead>
                            <TableHead onClick={() => handleSort('phone')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Phone Number')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('gender')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Gender')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('shop_id')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Shop')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('created_at')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Created at')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('created_by')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Created by')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('updated_at')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Updated at')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('updated_by')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Updated by')}
                                </span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData?.data?.map((item: any, index: number) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.id}
                                    {/* {tableData?.current_page > 1 ? tableData?.per_page * (tableData?.current_page - 1) + index + 1 : index + 1} */}
                                </TableCell>
                                <TableCell>
                                    <span className="flex h-full items-center justify-start">
                                        <ViewButton item={item} />
                                        {hasPermission('user delete') && <DeleteButton deletePath="/admin/users/" id={item.id} />}
                                        {hasPermission('user update') && <EditButton item={item} />}
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
                                                src={`/assets/images/users/thumb/` + item.image}
                                                width={100}
                                                height={100}
                                                alt=""
                                                className="size-10 object-contain transition-all duration-300 hover:scale-150"
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
                                <TableCell>{item.name || '---'}</TableCell>
                                <TableCell>{item.email || '---'}</TableCell>
                                <TableCell>
                                    {item?.roles?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {item?.roles?.map((role: any) => (
                                                <div className="flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-sky-400 to-indigo-600 p-[2px]">
                                                    <Badge className="bg-background hover:bg-background text-foreground overflow-hidden rounded-full border-none">
                                                        {role.name}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        '---'
                                    )}
                                </TableCell>
                                <TableCell>{item.phone || '---'}</TableCell>
                                <TableCell className="capitalize">{item.gender || '---'}</TableCell>
                                <TableCell>
                                    {item.shop?.name ? (
                                        <Link className="hover:underline" href={`/admin/shops/${item.shop_id}`}>
                                            <Badge variant="outline" className="hover:underline">
                                                {item.shop?.name || '---'}
                                            </Badge>
                                        </Link>
                                    ) : (
                                        '---'
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.created_at
                                        ? new Date(item.created_at).toLocaleDateString('en-UK', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          })
                                        : '---'}
                                </TableCell>
                                <TableCell>{item.created_by?.name || '---'}</TableCell>
                                <TableCell>
                                    {item.updated_at
                                        ? new Date(item.updated_at).toLocaleDateString('en-UK', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          })
                                        : '---'}
                                </TableCell>
                                <TableCell>{item.updated_by?.name || '---'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {tableData?.data?.length < 1 && <MyNoData />}
        </>
    );
};

export default MyTableData;
