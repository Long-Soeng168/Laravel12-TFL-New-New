import MyNoData from '@/components/my-no-data';
import { MyTooltipButton } from '@/components/my-tooltip-button';
import usePermission from '@/hooks/use-permission';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { DownloadCloudIcon, FileIcon, ViewIcon } from 'lucide-react';
import { useState } from 'react';
import { useFileManager } from '../hooks/FileManagerContext';
import CopyFileUrl from './copy-file-url';
import DeleteFileButton from './delete-file-button';
import { Pagination } from './pagination';
import { ViewImage } from './view-image';

const extensionColors = {
    pdf: {
        bg: 'bg-red-400',
        stroke: 'stroke-red-400',
        shadow: 'shadow-red-700/30 dark:shadow-red-100/20',
    },
    doc: {
        bg: 'bg-blue-400',
        stroke: 'stroke-blue-400',
        shadow: 'shadow-blue-700/30 dark:shadow-blue-100/20',
    },
    docx: {
        bg: 'bg-blue-400',
        stroke: 'stroke-blue-400',
        shadow: 'shadow-blue-700/30 dark:shadow-blue-100/20',
    },
    xls: {
        bg: 'bg-green-600',
        stroke: 'stroke-green-600',
        shadow: 'shadow-green-700/30 dark:shadow-green-100/20',
    },
    xlsx: {
        bg: 'bg-green-600',
        stroke: 'stroke-green-600',
        shadow: 'shadow-green-700/30 dark:shadow-green-100/20',
    },
    txt: {
        bg: 'bg-gray-400',
        stroke: 'stroke-gray-400',
        shadow: 'shadow-gray-700/30 dark:shadow-gray-100/20',
    },
    csv: {
        bg: 'bg-amber-500',
        stroke: 'stroke-amber-500',
        shadow: 'shadow-amber-700/30 dark:shadow-amber-100/20',
    },
    json: {
        bg: 'bg-lime-500',
        stroke: 'stroke-lime-500',
        shadow: 'shadow-lime-700/30 dark:shadow-lime-100/20',
    },
    zip: {
        bg: 'bg-indigo-400',
        stroke: 'stroke-indigo-400',
        shadow: 'shadow-indigo-700/30 dark:shadow-indigo-100/20',
    },
    rar: {
        bg: 'bg-indigo-500',
        stroke: 'stroke-indigo-500',
        shadow: 'shadow-indigo-700/30 dark:shadow-indigo-100/20',
    },
    mp3: {
        bg: 'bg-pink-500',
        stroke: 'stroke-pink-500',
        shadow: 'shadow-pink-700/30 dark:shadow-pink-100/20',
    },
    wav: {
        bg: 'bg-pink-500',
        stroke: 'stroke-pink-500',
        shadow: 'shadow-pink-700/30 dark:shadow-pink-100/20',
    },
    mp4: {
        bg: 'bg-orange-500',
        stroke: 'stroke-orange-500',
        shadow: 'shadow-orange-700/30 dark:shadow-orange-100/20',
    },
    webm: {
        bg: 'bg-orange-400',
        stroke: 'stroke-orange-400',
        shadow: 'shadow-orange-700/30 dark:shadow-orange-100/20',
    },
    avi: {
        bg: 'bg-orange-600',
        stroke: 'stroke-orange-600',
        shadow: 'shadow-orange-700/30 dark:shadow-orange-100/20',
    },
    default: {
        bg: 'bg-gray-400',
        stroke: 'stroke-gray-400',
        shadow: 'shadow-gray-700/30 dark:shadow-gray-100/20',
    },
};

const FileTableData = ({ handleInsertMedia }: { handleInsertMedia?: (type: 'image' | 'file', url: string, fileName?: string) => void }) => {
    const hasPermission = usePermission();
    const [selectedImage, setSelectedImage] = useState('');
    const [isOpenViewImages, setIsOpenViewImages] = useState(false);
    const { fileTableData, setIsOpenFileManager } = useFileManager();
    const { CKEDITOR_USE_FILE_FULL_PATH } = usePage().props;
    return (
        <div className="overflow-y-auto p-4 pt-2">
            <ViewImage selectedImage={selectedImage} open={isOpenViewImages} setOpen={setIsOpenViewImages} />
            {fileTableData?.data?.length < 1 && <MyNoData />}
            <div className="mt-1 grid grid-cols-3 gap-4 lg:grid-cols-4">
                {fileTableData?.data?.map((item, i) => (
                    <div key={item.id}>
                        <div
                            key={i}
                            className="bg-muted group hover:bg-primary/10 relative flex aspect-square max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg"
                        >
                            {item.mime_type.startsWith('image/') ? (
                                <button
                                    type="button"
                                    onClick={(e: React.MouseEvent) => {
                                        handleInsertMedia(
                                            'image',
                                            `${CKEDITOR_USE_FILE_FULL_PATH ? window.location.origin : ''}/${item.path}/${item.name}`,
                                        );
                                        setIsOpenFileManager(false);
                                    }}
                                    // onClick={() => {
                                    //     setSelectedImage(`/${item.path}/${item.name}`);
                                    //     setIsOpenViewImages(true);
                                    // }}
                                >
                                    <img
                                        className="cursor-pointer transition-all duration-300 hover:scale-150"
                                        src={`/${item.path}/thumb/${item.name}`}
                                        alt=""
                                    />
                                </button>
                            ) : (
                                <span className="relative">
                                    {(() => {
                                        const ext = item.extension?.toLowerCase();
                                        const color = extensionColors[ext] || extensionColors.default;

                                        return (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleInsertMedia(
                                                        'file',
                                                        `${CKEDITOR_USE_FILE_FULL_PATH ? window.location.origin : ''}/${item.path}/${item.name}`,
                                                        item.name,
                                                    );
                                                    setIsOpenFileManager(false);
                                                }}
                                            >
                                                <FileIcon
                                                    size={100}
                                                    className={cn('text-muted-foreground stroke-current stroke-[0.8px]', color.stroke)}
                                                />
                                                <p
                                                    className={cn(
                                                        'absolute bottom-5/12 left-2 translate-y-1/2 rounded border border-white px-2 text-center font-semibold text-white uppercase shadow-[3px_3px_0px_0px]',
                                                        color.bg,
                                                        color.shadow,
                                                    )}
                                                >
                                                    {item.extension}
                                                </p>
                                            </button>
                                        );
                                    })()}
                                </span>
                            )}

                            <div className="absolute top-0 right-0 flex gap-1 p-1 transition-all duration-300 group-hover:flex lg:hidden">
                                {hasPermission('file_manager delete') && (
                                    <DeleteFileButton key={item.id} deletePath="/api/file_manager/files/" id={item.id} />
                                )}
                                {hasPermission('file_manager view') && (
                                    <>
                                        <MyTooltipButton
                                            onClick={() => {
                                                if (item.mime_type.startsWith('image/')) {
                                                    setSelectedImage(`/${item.path}/${item.name}`);
                                                    setIsOpenViewImages(true);
                                                } else {
                                                    window.open(`/${item.path}/${item.name}`, '_blank');
                                                }
                                            }}
                                            size="icon"
                                            title={item.mime_type.startsWith('image/') ? 'View Image' : 'Dowlonad File'}
                                            className="bg-muted/60 h-8 w-8 p-0"
                                        >
                                            {item.mime_type.startsWith('image/') ? <ViewIcon /> : <DownloadCloudIcon />}
                                        </MyTooltipButton>
                                        <CopyFileUrl url={`${CKEDITOR_USE_FILE_FULL_PATH ? window.location.origin : ''}/${item.path}/${item.name}`} />
                                    </>
                                )}
                            </div>
                            {/* {item.mime_type.startsWith('image/') && (
                                <div className="absolute bottom-1 left-1 max-w-full gap-1 rounded-tr-md rounded-bl-md bg-white px-2 text-xs whitespace-nowrap text-black transition-all duration-300 group-hover:flex">
                                    <span>{`${item.width} x ${item.height}`}</span>
                                </div>
                            )} */}
                            {/* {item.extension && item.mime_type.startsWith('image/') && (
                                <div className="absolute right-1 bottom-1 gap-1 rounded-tl-md rounded-br-md bg-white px-2 text-base text-black transition-all duration-300 group-hover:flex">
                                    <span>{`.${item.extension}`}</span>
                                </div>
                            )} */}
                        </div>
                        <p className="max-w-full overflow-hidden pt-1 text-center text-xs overflow-ellipsis">{item.name}</p>
                        <p className="py-1 text-center text-[10px]">
                            {item.mime_type.startsWith('image/') && `${item.width} x ${item.height} / `} ({item.size} Kb)
                        </p>
                    </div>
                ))}
            </div>
            <Pagination />
        </div>
    );
};

export default FileTableData;
