import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarRail } from '@/components/ui/sidebar';
import { FoldersIcon } from 'lucide-react';
import { useFileManager } from '../hooks/FileManagerContext';
import Tree from './tree';
const SidebarTree = () => {
    const { folderTableData, currentFolder, setCurrentFolder, setPage } = useFileManager();
    return (
        <Sidebar className="hidden md:flex">
            <ScrollArea className="h-[85vh] w-auto">
                <SidebarContent>
                    <SidebarGroup>
                        {/* <SidebarGroupLabel className="flex justify-between">Folders</SidebarGroupLabel> */}
                        <SidebarGroupContent>
                            <button
                                onClick={() => {
                                    setPage(1);
                                    setCurrentFolder(null);
                                }}
                                className={`decoration-primary mt-1 mb-2 flex flex-1 cursor-pointer items-center gap-x-2 px-1.5 decoration-2 underline-offset-2 transition-all duration-300 hover:underline hover:decoration-3 hover:underline-offset-4 focus-visible:outline-none ${currentFolder === null && 'underline text-primary font-bold stroke-primary'}`}
                            >
                                <FoldersIcon />
                                <span>Folders</span>
                            </button>
                            <SidebarMenu>{folderTableData?.map((item, index) => <Tree key={item.id} item={item} />)}</SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <ScrollBar orientation="horizontal" />
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <SidebarRail />
        </Sidebar>
    );
};

export default SidebarTree;
