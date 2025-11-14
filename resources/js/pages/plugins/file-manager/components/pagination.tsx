import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { useFileManager } from '../hooks/FileManagerContext';

export function Pagination() {
    const { fileTableData, page, setPage } = useFileManager();
    const links = fileTableData?.links || null;
    const lastPage = fileTableData?.last_page;

    return (
        <div className="col-span-4 mt-4 mb-2 flex max-w-[100vw] flex-wrap justify-center gap-2 p-2">
            <button
                className={`cursor-pointer rounded border px-3 py-1 whitespace-nowrap transition-all duration-300 ${page === 1 ? 'text-foreground/40 cursor-not-allowed' : 'hover:border-primary hover:shadow-primary hover:-translate-1.5 hover:shadow-[5px_5px_0px_0px] dark:hover:shadow-white'}`}
                onClick={() => {
                    if (page == 1) return;
                    setPage(page === 1 ? 1 : parseInt(page) - 1);
                }}
            >
                <span className="flex items-center">
                    <ChevronsLeftIcon />
                    Previous
                </span>
            </button>
            {links?.slice(1, -1)?.map((item: any, index: number) => (
                <button
                    key={item.label + index}
                    className={`cursor-pointer rounded border px-3 py-1 whitespace-nowrap transition-all duration-300 ${item.active && 'bg-primary text-primary-foreground hover:border-primary-foreground dark:hover:border-black'} ${item.url == null ? 'text-foreground/40 cursor-not-allowed' : 'hover:border-primary hover:shadow-primary hover:-translate-1.5 hover:shadow-[5px_5px_0px_0px] dark:hover:shadow-white'}`}
                    onClick={() => {
                        if (parseInt(item.label) == page) return;
                        setPage(item.label);
                    }}
                    dangerouslySetInnerHTML={{ __html: item.label }}
                />
            ))}
            <button
                className={`cursor-pointer rounded border px-3 py-1 whitespace-nowrap transition-all duration-300 ${page == lastPage ? 'text-foreground/40 cursor-not-allowed' : 'hover:border-primary hover:shadow-primary hover:-translate-1.5 hover:shadow-[5px_5px_0px_0px] dark:hover:shadow-white'}`}
                onClick={() => {
                    if (page == lastPage) return;
                    setPage(page == lastPage ? lastPage : parseInt(page) + 1);
                }}
            >
                 <span className="flex items-center">
                    Next
                    <ChevronsRightIcon />
                </span>
                
            </button>
        </div>
    );
}
