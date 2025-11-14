import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import React from 'react';
import { useFileManager } from '../hooks/FileManagerContext';
const TopBreadcrumb = () => {
    const { currentFolder, setCurrentFolder, setPage } = useFileManager();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink
                        onClick={() => {
                            setPage(1);
                            setCurrentFolder(null);
                        }}
                        className="cursor-pointer"
                    >
                        Folders
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {currentFolder?.path?.length > 0 && <BreadcrumbSeparator />}
                {currentFolder?.path?.map((item, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="cursor-pointer" onClick={() => {
                                setPage(1);
                                setCurrentFolder(item);
                            }}>
                                {item.name}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index !== currentFolder?.path.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
                {currentFolder && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{currentFolder.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default TopBreadcrumb;
