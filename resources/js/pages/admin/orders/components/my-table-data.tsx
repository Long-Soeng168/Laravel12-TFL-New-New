import DeleteButton from '@/components/delete-button';
import MyImageGallery from '@/components/my-image-gallery';
import MyNoData from '@/components/my-no-data';
import { MyTooltipButton } from '@/components/my-tooltip-button';
import PaymentMethodLabel from '@/components/PaymentMethodLabel';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';
import { TransactionDetailDialog } from '@/pages/nokor-tech/components/TransactionDetailDialog';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowUpDown, ScanEyeIcon } from 'lucide-react';
import { useState } from 'react';
import { ShopHoverCard } from './ShopHoverCard';
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
                            <TableHead onClick={() => handleSort('id')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('ID')}
                                </span>
                            </TableHead>
                            <TableHead className="text-left">{t('Action')}</TableHead>

                            <TableHead onClick={() => handleSort('status')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Order Status')}
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

                            <TableHead onClick={() => handleSort('shop_id')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Shop')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('payment_method')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Payment Gateway')}
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
                            <TableHead onClick={() => handleSort('notify_telegram_status')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Notify Telegram')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('created_at')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Created at')}
                                </span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData?.data?.map((item: any, index: number) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium whitespace-nowrap capitalize">{item.id}</TableCell>
                                <TableCell>
                                    <span className="flex h-full items-center justify-start gap-1">
                                        <Link href={`/admin/orders/${item.id}`}>
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
                                                <DeleteButton deletePath="/admin/orders/" id={item.id} />
                                            </span>
                                        )}
                                    </span>
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    {item.currency == 'KHR' ? '៛ ' : '$ '} {item.total_amount}
                                </TableCell>

                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    <UserHoverCard user={item?.buyer} />
                                </TableCell>

                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    {item?.shop ? <ShopHoverCard shop={item?.shop} /> : ''}
                                </TableCell>

                                <TableCell className="font-medium whitespace-nowrap">
                                    <PaymentMethodLabel value={item?.payment_method || '---'} />
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap">
                                    <PaymentMethodLabel value={item?.payment_method_bic || '---'} />
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap">{item.transaction_id || '---'}</TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    <StatusBadge status={item.payment_status} />
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    <Badge variant={item.notify_telegram_status == 'completed' ? 'default' : 'secondary'}>
                                        {item.notify_telegram_status || 'NA'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {item.updated_at
                                        ? new Date(item.created_at).toLocaleDateString('en-UK', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: 'numeric',
                                              minute: 'numeric',
                                              hour12: true,
                                          })
                                        : '---'}
                                </TableCell>
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
