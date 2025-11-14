import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMainUser({ items = [] }: { items: NavItem[] }) {
    const { t } = useTranslation();
    const page = usePage();
    const hasRole = useRole();
    return (
        <SidebarGroup className="px-2 py-0">
            {/* <SidebarGroupLabel>{t('User Menu')}</SidebarGroupLabel> */}
            <SidebarMenu>
                {items.map((item) => {
                    if (item.permission && !hasRole(item.permission)) return null;

                    return item.subItems?.length > 0 ? (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.url === page.url || item.subItems?.some((sub) => sub.url === page.url) || page.url.startsWith(item.url)}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <div className="flex w-full items-center">
                                        {item.external_url && item.url == '' ? (
                                            <a href={item.external_url} target="_blank" className="flex flex-1">
                                                <SidebarMenuButton className="cursor-pointer">
                                                    {item.icon && <item.icon />}
                                                    <span className="leading-[2]">{item.title}</span>
                                                </SidebarMenuButton>
                                            </a>
                                        ) : (
                                            <Link href={item.url} prefetch className="flex flex-1">
                                                <SidebarMenuButton className="cursor-pointer">
                                                    {item.icon && <item.icon />}
                                                    <span className="leading-[2]">{item.title}</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        )}

                                        <SidebarMenuButton tooltip={item.title} className="cursor-pointerf w-auto">
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.subItems.map((subItem) => {
                                            if (!hasRole(subItem.permission)) return null;
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton isActive={subItem.url === page.url} asChild>
                                                        {subItem.external_url && subItem.url == '' ? (
                                                            <a href={subItem.external_url} target="_blank">
                                                                {subItem.icon && <subItem.icon className="stroke-primary" />}
                                                                <span className="leading-[2]">{subItem.title}</span>
                                                            </a>
                                                        ) : (
                                                            <Link href={subItem.url} prefetch="hover">
                                                                {subItem.icon && <subItem.icon className="stroke-primary" />}
                                                                <span className="leading-[2]">{subItem.title}</span>
                                                            </Link>
                                                        )}
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.url === page.url} tooltip={{ children: item.title }}>
                                {item.external_url && item.url == '' ? (
                                    <a href={item.external_url} target="_blank">
                                        {item.icon && <item.icon />}
                                        <span className="leading-[2]">{item.title}</span>
                                    </a>
                                ) : (
                                    <Link href={item.url} prefetch>
                                        {item.icon && <item.icon />}
                                        <span className="leading-[2]">{item.title}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
