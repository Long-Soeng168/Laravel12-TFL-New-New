import axios from 'axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Create the context with the correct default value
const FileManagerContext = createContext(undefined);

export const FileManagerProvider = ({ children }: { children: ReactNode }) => {
    const [isOpenFileManager, setIsOpenFileManager] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [fileTableData, setFileTableData] = useState<any[]>([]);
    const [folderTableData, setFolderTableData] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);

    // Function to fetch file data
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [fileType, setFileType] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('desc');

    const getFileData = () => {
        axios
            .get(
                `/api/file_manager/files?search=${search}&page=${page}&sortBy=${sortBy}&sortDirection=${sortDirection}&folder_id=${currentFolder?.id || ''}&fileType=${fileType || ''}`,
            )
            .then((response) => {
                // console.log(response.data);
                setFileTableData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching files:', error);
                toast.error('Error fetching files');
                setError(error);
            });
    };

    const getFolderData = () => {
        axios
            .get('/api/file_manager/folders')
            .then((response) => {
                // console.log(response.data);
                setFolderTableData(response.data); // Set the data to state
            })
            .catch((error) => {
                console.error('Error fetching folders:', error);
                toast.error('Error fetching files:', error);
                setError(error); // Handle errors if any
            });
    };

    const handleSort = (fieldName: string) => {
        setPage(1);
        if (fieldName == sortBy) {
            if (sortDirection == 'asc') {
                setSortDirection('desc');
            } else {
                setSortDirection('asc');
            }
        } else {
            setSortBy(fieldName);
            setSortDirection('asc');
        }
    };

    const handleRefresh = () => {
        setSearch('');
        setPage(1);
        setSortBy('id');
        setSortDirection('desc');
        setFileType('');
        setCurrentFolder(null);
        getFileData();
    };

    const handleFileType = (fileType: string) => {
        setPage(1);
        setFileType(fileType);
    };

    useEffect(() => {
        getFileData();
        getFolderData();
    }, [currentFolder, page, sortBy, sortDirection, fileType]);

    return (
        <FileManagerContext.Provider
            value={{
                isOpenFileManager,
                setIsOpenFileManager,
                fileTableData,
                getFileData,
                folderTableData,
                getFolderData,
                error,
                currentFolder,
                setCurrentFolder,
                search,
                setSearch,
                page,
                setPage,
                sortBy,
                setSortBy,
                sortDirection,
                setSortDirection,
                handleSort,
                handleFileType,
                fileType,
                handleRefresh
            }}
        >
            {children}
        </FileManagerContext.Provider>
    );
};

// Custom hook to use FileManager context
export const useFileManager = () => {
    const context = useContext(FileManagerContext);
    if (!context) {
        throw new Error('useFileManager must be used within a FileManagerProvider');
    }
    return context;
};
