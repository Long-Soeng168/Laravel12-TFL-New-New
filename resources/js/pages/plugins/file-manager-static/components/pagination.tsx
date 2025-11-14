import { Link, usePage } from '@inertiajs/react';

export function Pagination() {
    const { tableData } = usePage().props;
    // const links = tableData?.links || null;
    const links = [
        {
            "url": null,
            "label": "&laquo; Previous",
            "active": false
        },
        {
            "url": "http://example.com/api/users?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": "http://example.com/api/users?page=2",
            "label": "2",
            "active": false
        },
        {
            "url": "http://example.com/api/users?page=3",
            "label": "3",
            "active": false
        },
        {
            "url": "http://example.com/api/users?page=2",
            "label": "Next &raquo;",
            "active": false
        }
    ];
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete('page');
    const queryString = new URLSearchParams(queryParams).toString();

    return (
        <div className="mt-4 mb-2 flex max-w-[100vw] flex-wrap justify-center gap-2 p-2">
            {links?.map((item: any, index: number) => (
                <Link
                    key={item.label + index}
                    preserveScroll={true}
                    className={`rounded border px-4 py-2 whitespace-nowrap transition-all duration-300 ${item.active && 'bg-primary text-primary-foreground hover:border-primary-foreground dark:hover:border-black'} ${item.url == null ? 'text-foreground/40 cursor-not-allowed' : 'hover:border-primary hover:shadow-primary hover:-translate-1.5 hover:shadow-[5px_5px_0px_0px] dark:hover:shadow-white'}`}
                    href={item.url != null ? item.url + `&${queryString}` : ''}
                    dangerouslySetInnerHTML={{ __html: item.label }}
                />
            ))}
        </div>
    );
}
