import {
    ChevronRight,
    ChevronsUpDownIcon,
    File,
    FilePlus2Icon,
    FilesIcon,
    FileTextIcon,
    FileVideoIcon,
    FilterIcon,
    Folder,
    FolderCogIcon,
    FolderOpenIcon,
    FolderPenIcon,
    FolderPlusIcon,
    FolderXIcon,
    ImageIcon,
} from 'lucide-react';
import * as React from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { AddFiles } from './components/add-files';
import { AddFolder } from './components/add-folder';
import { EditFolderName } from './components/edit-folder-name';
import FileTableData from './components/files-table-data';

const data = {
    tree: [
        ['All Images', ['api', ['hello', ['route.ts']], 'page.tsx', 'layout.tsx', ['blog', ['page.tsx']]]],
        ['app', ['api', ['hello', ['route.ts']], 'page.tsx', 'layout.tsx', ['blog', ['page.tsx']]]],
        ['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
        ['lib', ['util.ts']],
        ['public', 'favicon.ico', 'vercel.svg'],
        '.eslintrc.json',
        '.gitignore',
        'next.config.js',
        'tailwind.config.js',
        'package.json',
        'README.md',
    ],
};

export function MyFileManagerDialog() {
    const [open, setOpen] = React.useState(true);
    const [openUploadFileDialog, setOpenUploadFileDialog] = React.useState(false);
    const [openAddFolderDialog, setOpenAddFolderDialog] = React.useState(false);
    const [openEditFolderNameDialog, setOpenEditFolderNameDialog] = React.useState(false);
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'u' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenUploadFileDialog((open) => !open);
            }
            if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenAddFolderDialog((open) => !open);
            }
            if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenEditFolderNameDialog((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);
    return (
        <>
            <span>
                <EditFolderName open={openEditFolderNameDialog} setOpen={setOpenEditFolderNameDialog} />
                <AddFolder open={openAddFolderDialog} setOpen={setOpenAddFolderDialog} />
                <AddFiles open={openUploadFileDialog} setOpen={setOpenUploadFileDialog} />
            </span>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent className="h-[85vh] overflow-hidden p-0 md:max-h-[800px] md:max-w-[800px] lg:max-w-[900px]">
                    <DialogTitle className="sr-only">Settings</DialogTitle>
                    <DialogDescription className="sr-only">Customize your settings here.</DialogDescription>
                    <SidebarProvider className="items-start">
                        <Sidebar className="hidden md:flex">
                            <ScrollArea className="h-[85vh] w-full">
                                <SidebarContent>
                                    <SidebarGroup>
                                        <SidebarGroupLabel className="flex justify-between">Folders</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                            <div className="decoration-primary mb-2 flex flex-1 cursor-pointer items-center gap-x-2 px-1.5 decoration-2 underline-offset-2 transition-all duration-300 hover:font-bold hover:underline">
                                                <FolderOpenIcon />
                                                Files
                                            </div>
                                            <SidebarMenu>
                                                {data.tree.map((item, index) => (
                                                    <Tree key={index} item={item} />
                                                ))}
                                            </SidebarMenu>
                                        </SidebarGroupContent>
                                    </SidebarGroup>
                                </SidebarContent>
                                <ScrollBar orientation="horizontal" />
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                            <SidebarRail />
                        </Sidebar>
                        <main className="flex h-[85vh] flex-1 flex-col overflow-hidden">
                            <header className="mr-12 flex shrink-0 items-center gap-2 border-white/50 pt-2 pb-1 transition-[width,height] ease-linear">
                                <div className="flex items-center gap-2 px-4 py-2">
                                    <Button size="icon" variant="ghost" className="self-start bg-transparent hover:bg-transparent">
                                        <SidebarTrigger />
                                    </Button>
                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            <BreadcrumbItem>
                                                <BreadcrumbLink>Files</BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>All Images</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </BreadcrumbList>
                                    </Breadcrumb>
                                </div>
                            </header>
                            <div className="flex gap-2 px-4 pb-2">
                                <Input placeholder="Search File Name" />
                                {/* Start Action */}
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <FilterIcon />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[200px]">
                                            <DropdownMenuLabel>File Type</DropdownMenuLabel>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <FilesIcon /> All Types
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <ImageIcon /> Image
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <FileTextIcon />
                                                    PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <FileVideoIcon />
                                                    Video
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <ChevronsUpDownIcon /> Upload Date
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <ChevronsUpDownIcon /> File Name
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <ChevronsUpDownIcon /> File Type
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="text-primary" size="icon">
                                                <FolderCogIcon />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[200px]">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onClick={() => setOpenUploadFileDialog(true)}>
                                                    <FilePlus2Icon /> Upload Files
                                                    <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setOpenAddFolderDialog(true)}>
                                                    <FolderPlusIcon /> Add Sub-Folder
                                                    <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setOpenEditFolderNameDialog(true)}>
                                                    <FolderPenIcon />
                                                    Edit Name
                                                    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <FolderXIcon /> Delete Folder
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                {/* End Action */}
                            </div>

                            {/* Start Table Data */}
                            <FileTableData />
                            {/* End Table Data */}
                        </main>
                    </SidebarProvider>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Tree({ item }: { item: string | any[] }) {
    const [name, ...items] = Array.isArray(item) ? item : [item];
    if (!items.length) {
        return (
            <SidebarMenuButton isActive={name === 'button.tsx'} className="data-[active=true]:bg-transparent">
                <File />
                {name}
            </SidebarMenuButton>
        );
    }
    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>div>button>svg:first-child]:rotate-90"
                defaultOpen={name === 'components' || name === 'ui'}
            >
                <div className="flex items-center gap-0.5">
                    <CollapsibleTrigger className="w-auto" asChild>
                        <SidebarMenuButton>
                            <ChevronRight className="transition-transform" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <div className="decoration-primary flex w-full flex-1 cursor-pointer items-center gap-x-2 decoration-2 underline-offset-2 transition-all duration-300 hover:font-bold hover:underline">
                        <Folder />
                        {name}
                    </div>
                </div>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((subItem, index) => (
                            <Tree key={index} item={subItem} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}
