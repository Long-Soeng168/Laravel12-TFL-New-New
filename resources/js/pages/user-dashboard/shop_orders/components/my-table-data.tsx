import DeleteButton from '@/components/delete-button';
import MyImageGallery from '@/components/my-image-gallery';
import MyNoData from '@/components/my-no-data';
import { MyTooltipButton } from '@/components/my-tooltip-button';
import PaymentMethodLabel from '@/components/PaymentMethodLabel';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';
import { TransactionDetailDialog } from '@/pages/nokor-tech/components/TransactionDetailDialog';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowUpDown, ScanEyeIcon } from 'lucide-react';
import { useState } from 'react';
import { UserHoverCard } from './UserHoverCard';

const MyTableData = () => {
    const { t } = useTranslation();

    const hasRole = useRole();

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
                    imagePath="/assets/images/items/"
                    selectedImages={selectedImages}
                    isOpenViewImages={isOpenViewImages}
                    setIsOpenViewImages={setIsOpenViewImages}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left">{t('Action')}</TableHead>
                            <TableHead onClick={() => handleSort('status')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Order Status')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('order_number')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Order Number')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('total_amount')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Total Amount')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('user_id')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Buyer')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('payment_method')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Payment Method')}
                                </span>
                            </TableHead>
                            <TableHead>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Transaction ID')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('payment_status')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Payment Status')}
                                </span>
                            </TableHead>

                            {/* <TableHead onClick={() => handleSort('updated_at')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Updated at')}
                                </span>
                            </TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData?.data?.map((item: any, index: number) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <span className="flex h-full items-center justify-start gap-1">
                                        <Link href={`/shop-orders/${item.id}`}>
                                            <MyTooltipButton title={t('View Order')} side="bottom" variant="outline" className="text-primary">
                                                <ScanEyeIcon /> View
                                            </MyTooltipButton>
                                        </Link>
                                        {/* <Link href={`/user-orders/${item.id}/edit`}>
                                            <MyTooltipButton title={t('Edit')} side="bottom" variant="ghost">
                                                <EditIcon />
                                            </MyTooltipButton>
                                        </Link> */}

                                        {/* Show Transaction Detail */}
                                        <span className="rounded-md border">
                                            <TransactionDetailDialog order_id={item?.id} detail={item.transaction_detail || '---'} />
                                        </span>
                                        {/* End Show Transaction Detail */}
                                        {item?.status == 'pending' && (
                                            <span className="rounded-md border p-0.5">
                                                <DeleteButton deletePath="/shop-orders/" id={item.id} />
                                            </span>
                                        )}
                                    </span>
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap">
                                    <div>
                                        <p className="font-bold">{item.order_number.split('-').slice(1).join('-')}</p>
                                        <p className="text-muted-foreground">
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleString('en-UK', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: '2-digit',
                                                      hour: 'numeric',
                                                      minute: 'numeric',
                                                      hour12: true, // 👈 forces AM/PM
                                                  })
                                                : '---'}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    {item.currency == 'KHR' ? '៛ ' : '$ '} {item.total_amount}
                                </TableCell>

                                {item?.buyer && (
                                    <TableCell className="font-medium whitespace-nowrap capitalize">
                                        {/* <Badge variant="outline">{item.buyer?.name}</Badge> */}
                                        <UserHoverCard user={item?.buyer} />
                                    </TableCell>
                                )}

                                <TableCell className="font-medium whitespace-nowrap">
                                    <PaymentMethodLabel value={item?.payment_method} />
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap">{item.tran_id}</TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    <StatusBadge status={item.payment_status} />
                                </TableCell>
                                {/* <TableCell>
                                    {item.images[0] ? (
                                        <button
                                            onClick={() => {
                                                setSelectedImages(item.images);
                                                setIsOpenViewImages(true);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <img
                                                src={`/assets/images/items/thumb/` + item.images[0]?.image}
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
                                </TableCell> */}
                                {/* <TableCell className="text-center">
                                    {item.link ? (
                                        <a href={`${item.link}`} target="_blank">
                                            <MyTooltipButton variant="ghost" title={item.link} className="p-0 hover:bg-transparent">
                                                {item.source_detail ? (
                                                    <span>
                                                        <img
                                                            src={`/assets/images/links/thumb/${item?.source_detail?.image}`}
                                                            className="aspect-square h-10 object-contain"
                                                            alt=""
                                                        />
                                                    </span>
                                                ) : (
                                                    <SquareArrowOutUpRightIcon className="hover:stroke-3" />
                                                )}
                                            </MyTooltipButton>
                                        </a>
                                    ) : (
                                        '---'
                                    )}
                                </TableCell> */}

                                {/* <TableCell>{item.created_by?.name || '---'}</TableCell> */}
                                {/* <TableCell className="whitespace-nowrap">
                                    {item.updated_at
                                        ? new Date(item.updated_at).toLocaleDateString('en-UK', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          })
                                        : '---'}
                                </TableCell> */}
                                {/* <TableCell>{item.updated_by?.name || '---'}</TableCell> */}
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
