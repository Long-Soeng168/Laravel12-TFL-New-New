import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export function BreadcrumbComponent() {
    const { t, currentLocale } = useTranslation();
    const { selected_category, selected_brand } = usePage().props;

    const breadcrumbs = [
        { label: t('Home'), href: '/' },
        { label: t('Products'), href: '/products', active: selected_category?.name ? false : true },
    ];

    if (selected_category?.parent?.parent?.parent) {
        breadcrumbs.push({
            label: '...',
            href: `#`,
        });
    }
    if (selected_category?.parent?.parent) {
        breadcrumbs.push({
            label:
                currentLocale === 'kh'
                    ? selected_category.parent.parent.name_kh || selected_category.parent.parent.name
                    : selected_category.parent.parent.name,
            href: `/products?category_code=${selected_category.parent.parent.code}`,
        });
    }

    if (selected_category?.parent) {
        breadcrumbs.push({
            label: currentLocale === 'kh' ? selected_category.parent.name_kh || selected_category.parent.name : selected_category.parent.name,
            href: `/products?category_code=${selected_category.parent.code}`,
        });
    }

    if (selected_category) {
        breadcrumbs.push({
            label: currentLocale === 'kh' ? selected_category.name_kh || selected_category.name : selected_category.name,
            href: `/products?category_code=${selected_category.code}`,
            active: selected_brand?.code ? false : true,
        });
    }

    if (selected_brand?.code) {
        breadcrumbs.push({
            label: currentLocale === 'kh' ? selected_brand.name_kh || selected_brand.name : selected_brand.name,
            href: `#`,
            active: true,
        });
    }

    return (
        <Breadcrumb className="px-4 min-xl:px-0">
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                    <React.Fragment key={item.href}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                            {item.active ? (
                                // Active item style (not a link)
                                <span className="text-primary font-semibold">{item.label}</span>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
