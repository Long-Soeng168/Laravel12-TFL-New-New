import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';

export function MyPagination() {
    const { t } = useTranslation();
    const { tableData } = usePage().props;
    const links = tableData?.links || null;
    // console.log(links);
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete('page');
    const queryString = new URLSearchParams(queryParams)?.toString();

    const renderLabel = (label) => {
        if (label == '&laquo; Previous' || label == 'Next &raquo;') {
            return t(label);
        }
        return label;
    };

    if (!links?.length || (links.length === 3 && links[1].active)) {
        return null;
    }

    return (
        <div className="mt-4 mb-2 flex max-w-[100vw] flex-wrap justify-center gap-2 p-2">
            {links?.map((item: any, index: number) => (
                <Link
                    key={item.label + index}
                    preserveScroll={true}
                    className={`rounded border px-4 py-2 whitespace-nowrap transition-all duration-300 ${item.active && 'bg-primary text-primary-foreground hover:border-primary-foreground dark:hover:border-black'} ${item.url == null ? 'text-foreground/40 cursor-not-allowed' : 'hover:border-primary hover:shadow-primary hover:-translate-1.5 hover:shadow-[5px_5px_0px_0px] dark:hover:shadow-white'}`}
                    href={item.url != null ? item.url + `&${queryString}` : ''}
                    dangerouslySetInnerHTML={{ __html: renderLabel(item.label) }}
                />
            ))}
        </div>
    );
}
