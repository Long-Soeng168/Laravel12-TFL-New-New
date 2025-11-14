import MyImageGallery from '@/components/my-image-gallery';
import MyNoData from '@/components/my-no-data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowUpDown, EyeIcon, ListIcon } from 'lucide-react';
import { useState } from 'react';

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
                            <TableHead className="text-left">{t('Action')}</TableHead> {/* could be "Job Type" */}
                            <TableHead>{t('Type')}</TableHead>
                            <TableHead>{t('Status')}</TableHead>
                            <TableHead onClick={() => handleSort('created_at')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Created At')}
                                </span>
                            </TableHead>
                            <TableHead>{t('Delay')}</TableHead>
                            <TableHead onClick={() => handleSort('run_at')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Run At')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('completed_at')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Completed At')}
                                </span>
                            </TableHead>
                            <TableHead>{t('Note')}</TableHead>
                            <TableHead>{t('Payload')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData?.data?.map((job: any) => (
                            <TableRow key={job.id}>
                                <TableCell className="font-medium">{job.id}</TableCell>
                                <TableCell>
                                    <Link href={`/queue_job/${job.id}`}>
                                        <Button>
                                            <EyeIcon /> View
                                        </Button>
                                    </Link>
                                </TableCell>
                                <TableCell>{job.job_type}</TableCell>
                                <TableCell>
                                    {job.status === 'pending' && <span className="text-yellow-600">⏳ Pending</span>}
                                    {job.status === 'running' && <span className="text-blue-600">⚡ Running</span>}
                                    {job.status === 'completed' && <span className="text-green-600">✅ Completed</span>}
                                    {job.status === 'failed' && <span className="text-red-600">❌ Failed</span>}
                                </TableCell>
                                <TableCell>
                                    {job.created_at
                                        ? new Date(job.created_at).toLocaleString('en-GB', {
                                              timeZone: 'Asia/Bangkok',
                                              day: '2-digit',
                                              month: 'short',
                                              year: '2-digit',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                              second: '2-digit',
                                              hour12: true,
                                          })
                                        : '---'}
                                </TableCell>
                                <TableCell>
                                    {job.delay_second} {t('seconds')}
                                </TableCell>
                                <TableCell>
                                    {job.run_at
                                        ? new Date(job.run_at).toLocaleString('en-GB', {
                                              timeZone: 'Asia/Bangkok',
                                              day: '2-digit',
                                              month: 'short',
                                              year: '2-digit',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                              second: '2-digit',
                                              hour12: true,
                                          })
                                        : '---'}
                                </TableCell>
                                <TableCell>
                                    {job.completed_at
                                        ? new Date(job.completed_at).toLocaleString('en-GB', {
                                              timeZone: 'Asia/Bangkok',
                                              day: '2-digit',
                                              month: 'short',
                                              year: '2-digit',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                              second: '2-digit',
                                              hour12: true,
                                          })
                                        : '---'}
                                </TableCell>

                                <TableCell>{job.note || '---'}</TableCell>

                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">
                                                <ListIcon />
                                                Payload
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Payload Detail</DialogTitle>
                                                <DialogDescription></DialogDescription>
                                                <div>
                                                    <pre className="overflow-auto rounded p-2">{JSON.stringify(job.payload, null, 2)}</pre>
                                                </div>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
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
