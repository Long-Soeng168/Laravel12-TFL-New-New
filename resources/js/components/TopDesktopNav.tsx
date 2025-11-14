import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { ShopCategoriesNav } from './ShopCategoriesNav';

export function TopDesktopNav() {
  const { t } = useTranslation();
  const { url } = usePage();

  const navLinks = [
    { label: t('Home'), href: '/' },
    { label: t('Products'), href: '/products' },
    { label: t('Shops'), href: '/shops' },
  ];

  const isActive = (href: string) => url === href;

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {/* Shop Categories Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-secondary">
            {t('Shop Categories')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ShopCategoriesNav />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Main Nav Links */}
        {navLinks.map(({ label, href }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} ${
                isActive(href) ? 'text-primary font-bold' : ''
              }`}
            >
              <Link href={href} prefetch>
                {label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
