import { MyTooltipButton } from '@/components/my-tooltip-button';
import useTranslation from '@/hooks/use-translation';
import { CopyIcon, FileIcon, ViewIcon } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from './pagination';
import { ViewImage } from './view-image';

const FileTableData = () => {
    const { t } = useTranslation();
    const [selectedImages, setSelectedImages] = useState('');
    const [isOpenViewImages, setIsOpenViewImages] = useState(false);

    return (
        <div className="overflow-y-auto p-4 pt-2">
            <ViewImage open={isOpenViewImages} setOpen={setIsOpenViewImages} />
            <div className="mt-1 grid grid-cols-3 gap-4 lg:grid-cols-4">
                {/* PDF */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <div>
                        <div
                            key={i}
                            className="bg-muted group relative flex aspect-square max-w-full items-center justify-center overflow-hidden rounded-xl"
                        >
                            <span className="relative">
                                <FileIcon size={100} className="stroke-blue-400 stroke-[0.8px]" />
                                <p className="absolute bottom-5/12 left-2 translate-y-1/2 rounded border border-white bg-blue-400 px-2 text-center font-semibold text-white uppercase shadow-[3px_3px_0px_0px] shadow-blue-700/30 dark:shadow-blue-100/20">
                                    {i / 2 === 0 ? 'pdf' : 'xlsx'}
                                </p>
                            </span>
                            <div className="absolute top-0 right-0 hidden gap-1 p-1 transition-all duration-300 group-hover:flex">
                                <MyTooltipButton
                                    onClick={() => {
                                        setSelectedImages('1743590260_1739950743b4rDCFr4qm.webp');
                                        setIsOpenViewImages(true);
                                    }}
                                    size="icon"
                                    title={t('Show')}
                                    className="bg-muted/60 h-8 w-8 p-0"
                                >
                                    <ViewIcon />
                                </MyTooltipButton>
                                <MyTooltipButton size="icon" title="Copy File URL" className="bg-muted/60 h-8 w-8 p-0">
                                    <CopyIcon />
                                </MyTooltipButton>
                            </div>
                        </div>
                        <p className="pt-1 text-center text-xs">Lorem ipsum dolor sit amet.png</p>
                        <p className="py-1 text-center text-[10px]">(113.3 Kb)</p>
                    </div>
                ))}

                {/* Images */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <div>
                        <div
                            key={i}
                            className="bg-muted group relative flex aspect-square max-w-full items-center justify-center overflow-hidden rounded-xl"
                        >
                            <img
                                className="transition-all duration-300 hover:scale-150"
                                src="/assets/images/pages/thumb/1743590260_1739950743b4rDCFr4qm.webp"
                                alt=""
                            />
                            <div className="absolute top-0 right-0 hidden gap-1 p-1 transition-all duration-300 group-hover:flex">
                                <MyTooltipButton
                                    onClick={() => {
                                        setSelectedImages('1743590260_1739950743b4rDCFr4qm.webp');
                                        setIsOpenViewImages(true);
                                    }}
                                    size="icon"
                                    title={t('Show')}
                                    className="bg-muted/60 h-8 w-8 p-0"
                                >
                                    <ViewIcon />
                                </MyTooltipButton>
                                <MyTooltipButton size="icon" title="Copy File URL" className="bg-muted/60 h-8 w-8 p-0">
                                    <CopyIcon />
                                </MyTooltipButton>
                            </div>
                        </div>
                        <p className="pt-1 text-center text-xs">Lorem ipsum dolor sit amet.png</p>
                        <p className="py-1 text-center text-[10px]">300 x 600 (113.3 Kb)</p>
                    </div>
                ))}
            </div>
            <Pagination />
        </div>
    );
};

export default FileTableData;
