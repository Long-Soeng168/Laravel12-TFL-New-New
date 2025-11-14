import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import { ChevronRight, Folder, FolderOpenIcon } from 'lucide-react';
import { useFileManager } from '../hooks/FileManagerContext';

interface FolderItem {
    id: number;
    name: string;
    parent_id: number | null;
    path: FolderItem[];
}

interface TreeProps {
    item: FolderItem;
}

const Tree = ({ item }: { item: {} | any[] }) => {
    const { currentFolder, setCurrentFolder, setPage } = useFileManager();
    return (
        <SidebarMenuItem>
            <Collapsible className="group/collapsible [&[data-state=open]>div>button>svg:first-child]:rotate-90">
                <div className="flex items-center gap-0.5">
                    <CollapsibleTrigger className={`w-auto ${!item.children?.length && 'invisible'}`} asChild>
                        <SidebarMenuButton>
                            <ChevronRight className="transition-transform" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <button
                        onClick={() => {
                            setPage(1);
                            setCurrentFolder(item);
                        }}
                        className={`decoration-primary flex w-full flex-1 cursor-pointer items-center gap-x-2 whitespace-nowrap decoration-2 underline-offset-2 transition-all duration-300 hover:underline hover:decoration-3 hover:underline-offset-4 ${item?.id === currentFolder?.id && 'underline text-primary stroke-primary'}`}
                    >
                        <span>{item?.id === currentFolder?.id ? <FolderOpenIcon /> : <Folder />}</span>

                        {item.name}
                    </button>
                </div>
                <CollapsibleContent>
                    <SidebarMenuSub>{item.children?.map((subItem, index) => <Tree key={subItem.id} item={subItem} />)}</SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
};

export default Tree;
