import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTranslation from '@/hooks/use-translation';
import {
    FileArchiveIcon,
    FilesIcon,
    FileSpreadsheet,
    FileTextIcon,
    FileVideoIcon,
    FilterIcon,
    ImageIcon,
    MoveDown,
    MoveUp,
    MusicIcon,
    NotepadText,
} from 'lucide-react';
import { useFileManager } from '../hooks/FileManagerContext';

const Filter = () => {
    const { t } = useTranslation();
    
    const fileTypeOptions = [
        { type: '', label: t('All Types'), icon: FilesIcon },
        { type: 'video', label: 'Videos', icon: FileVideoIcon },
        { type: 'audio', label: 'Audio', icon: MusicIcon },
        { type: 'image', label: 'Images', icon: ImageIcon },
        { type: 'pdf', label: 'PDF', icon: FileTextIcon },
        { type: 'office', label: 'Microsoft Office', icon: FileSpreadsheet },
        { type: 'text', label: 'Text Files', icon: NotepadText },
        { type: 'archive', label: 'Archive (.zip, .rar)', icon: FileArchiveIcon },
    ];

    const { handleSort, sortDirection, sortBy, handleFileType, fileType } = useFileManager();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <span className="rounded-xl border p-1">
                    <Button variant="outline" size="icon" className="relative">
                        <FilterIcon className="stroke-foreground/60" />
                        {fileType && (
                            <div className="absolute -top-1 -right-1">
                                <span className="relative flex size-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                                </span>
                            </div>
                        )}
                    </Button>
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>{t('Sort By')}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleSort('created_at')}>
                        <span className="flex">
                            <MoveUp className={`${sortBy == 'created_at' && sortDirection == 'asc' && 'stroke-primary stroke-3'}`} />
                            <MoveDown
                                className={`-translate-x-2 ${sortBy == 'created_at' && sortDirection == 'desc' && 'stroke-primary stroke-3'}`}
                            />
                            {t('Upload Date')}
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('name')}>
                        <span className="flex">
                            <MoveUp className={`${sortBy == 'name' && sortDirection == 'asc' && 'stroke-primary stroke-3'}`} />
                            <MoveDown className={`-translate-x-2 ${sortBy == 'name' && sortDirection == 'desc' && 'stroke-primary stroke-3'}`} />
                            {t('File Name')}
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('mime_type')}>
                        <span className="flex">
                            <MoveUp className={`${sortBy == 'mime_type' && sortDirection == 'asc' && 'stroke-primary stroke-3'}`} />
                            <MoveDown className={`-translate-x-2 ${sortBy == 'mime_type' && sortDirection == 'desc' && 'stroke-primary stroke-3'}`} />
                            {t('File Type')}
                        </span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>{t('File Type')}</DropdownMenuLabel>
                    {fileTypeOptions.map(({ type, label, icon: Icon }) => (
                        <DropdownMenuItem
                            className={`${fileType == type && 'text-primary stroke-primary font-bold underline'}`}
                            key={type ?? 'all'}
                            onClick={() => handleFileType(type)}
                        >
                            <Icon className={`${fileType == type && 'stroke-primary'} h-4 w-4`} />
                            {label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Filter;
