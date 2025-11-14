import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { GripIcon } from 'lucide-react';

export function CategorySelectBreadcrumb({
    selectedCategory,
    selectedSubCategory,
    setSelectedCategory,
    setSelectedSubCategory,
    setFinalCategorySelect,
}: {
    selectedCategory: any;
    selectedSubCategory: any;
    setSelectedCategory: any;
    setSelectedSubCategory: any;
    setFinalCategorySelect: any;
}) {
    const handleBackToRoot = () => {
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setFinalCategorySelect(null);
    };

    const handleBackToCategory = () => {
        setSelectedSubCategory(null);
        setFinalCategorySelect(selectedCategory);
    };

    const handleBack = () => {
        if (selectedSubCategory) {
            handleBackToCategory();
        } else if (selectedCategory) {
            handleBackToRoot();
        }
    };

    return (
        <div className="flex items-center justify-between">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        {selectedCategory || selectedSubCategory ? (
                            <BreadcrumbLink asChild>
                                <button onClick={handleBackToRoot} className="text-muted-foreground hover:text-primary cursor-pointer">
                                    Categories
                                </button>
                            </BreadcrumbLink>
                        ) : (
                            <BreadcrumbPage>
                                <div className="flex cursor-pointer items-center gap-1">
                                    <GripIcon size={16} />
                                    Categories
                                </div>
                            </BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    {selectedCategory && (
                        <>
                            <BreadcrumbItem>
                                {selectedSubCategory ? (
                                    <BreadcrumbLink asChild>
                                        <button onClick={handleBackToCategory} className="text-muted-foreground hover:text-primary cursor-pointer">
                                            {selectedCategory.name}
                                        </button>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{selectedCategory.name}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )}

                    {selectedSubCategory && (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{selectedSubCategory.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>

            {(selectedCategory || selectedSubCategory) && (
                <Button variant="ghost" size="sm" className="cursor-pointer text-sm" onClick={handleBack}>
                    ← Back
                </Button>
            )}
        </div>
    );
}
