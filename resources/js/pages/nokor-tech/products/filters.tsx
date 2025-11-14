import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useTranslation from '@/hooks/use-translation';
import { router, usePage } from '@inertiajs/react';
import { AlignLeft } from 'lucide-react';
import { useState } from 'react';

const Filters = () => {
    const { item_categories, item_brands, item_body_types } = usePage().props;
    const initialQueryParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    function handleSubmit(key: string, value?: string) {
        try {
            const queryParams = new URLSearchParams(window.location.search);
            if (value) {
                queryParams.set(key, value);
            } else {
                queryParams.delete(key);
            }
            queryParams.set('page', '1');
            const queryParamsString = queryParams?.toString();
            router.get(currentPath + '?' + queryParamsString);
        } catch (error) {
            console.error('Form submission error', error);
        }
    }

    // Brands
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(initialQueryParams?.get('brand_code') || '');
    // Brands

    // Body Type
    const [openBodyType, setOpenBodyType] = useState(false);
    const [valueBodyType, setValueBodyType] = useState(initialQueryParams?.get('body_type_code') || '');
    // Body Type

    const selectedCategoryCode = initialQueryParams.get('category_code') || '';

    // Find which parent category should be open
    const openCategory = item_categories?.find(
        (category) => category.code === selectedCategoryCode || category.children?.some((child) => child.code === selectedCategoryCode),
    )?.code;

    const { t } = useTranslation();
    return (
        <div>
            <div className="bg-primary/5 rounded-md px-2 py-2">
                <div className="flex flex-col items-center">
                    <h3 className="mb-4 text-xl font-semibold">{t("Filters")}</h3>
                </div>
                <div>
                    {item_categories?.length > 0 && (
                        <button
                            onClick={() => handleSubmit('category_code', '')}
                            className={`${!initialQueryParams.get('category_code') && 'text-true-primary font-bold underline underline-offset-4'} hover:text-primary flex w-full flex-1 cursor-pointer items-center gap-1 p-1 hover:underline`}
                        >
                            <span className="mr-1 size-6 object-contain">
                                <AlignLeft size={24} className="stroke-primary" />
                            </span>
                            {t("All Categories")}
                        </button>
                    )}

                    {item_categories?.length > 0 &&
                        item_categories?.map((category) => (
                            <Accordion type="single" collapsible defaultValue={openCategory}>
                                <AccordionItem value={category?.code}>
                                    <div className="m-0.5 flex w-full items-center justify-between text-base">
                                        <button
                                            onClick={() => handleSubmit('category_code', category?.code)}
                                            className={`${initialQueryParams.get('category_code') == category?.code && 'text-true-primary flex font-bold underline underline-offset-4'} hover:text-primary flex w-full flex-1 cursor-pointer items-center gap-1 p-1 hover:underline`}
                                        >
                                            {category?.image ? (
                                                <img
                                                    className="mr-1 size-6 object-contain"
                                                    src={`/assets/images/item_categories/thumb/${category?.image}`}
                                                    alt=""
                                                />
                                            ) : (
                                                <span className="mr-1 size-6 object-contain" />
                                            )}
                                            <span className="flex flex-1 items-center justify-between">
                                                {category?.name}
                                                {/* <span className="text-xs">({category?.items_count})</span> */}
                                            </span>
                                        </button>
                                        {category?.children?.length > 0 && (
                                            <AccordionTrigger className="hover:bg-secondary cursor-pointer border p-0.5"></AccordionTrigger>
                                        )}
                                    </div>
                                    {category?.children?.length > 0 && (
                                        <AccordionContent>
                                            <ul className="border-primary ml-4 border-l-2 pl-4 text-sm">
                                                {category?.children?.map((subCategory) => (
                                                    <li>
                                                        <button
                                                            className={`${initialQueryParams.get('category_code') == subCategory?.code && 'text-true-primary font-bold underline underline-offset-4'} hover:text-primary w-full cursor-pointer p-1 text-start hover:underline`}
                                                            onClick={() => handleSubmit('category_code', subCategory?.code)}
                                                        >
                                                            <span className="flex items-center">
                                                                {subCategory?.image ? (
                                                                    <img
                                                                        className="mr-1 size-5 object-contain"
                                                                        src={`/assets/images/item_categories/thumb/${subCategory?.image}`}
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <span className="mr-1 size-6 object-contain" />
                                                                )}
                                                                {subCategory?.name}
                                                            </span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    )}
                                </AccordionItem>
                            </Accordion>
                        ))}
                </div>
                {/* end category  */}

                {/* Brands */}
                {/* {item_brands?.length > 0 && (
                    <div className="mt-8">
                        <p className="text-primary mb-2 flex items-center gap-1 text-sm font-semibold">
                            <AlignLeft size={18} /> Brands
                        </p>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                                    {value
                                        ? (() => {
                                              const selectedBrand = item_brands.find((brand) => brand.code === value);
                                              return selectedBrand ? (
                                                  <div className="flex items-center gap-2">
                                                      {selectedBrand.image ? (
                                                          <span className="rounded bg-white p-0.5">
                                                              <img
                                                                  src={`/assets/images/item_brands/thumb/${selectedBrand.image}`}
                                                                  alt={selectedBrand.name}
                                                                  className="size-7 object-contain"
                                                              />
                                                          </span>
                                                      ) : (
                                                          <span className="size-8 object-contain" />
                                                      )}
                                                      {selectedBrand.name}
                                                  </div>
                                              ) : (
                                                  'Select brand...'
                                              );
                                          })()
                                        : 'Select brand...'}

                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search brand..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No brand found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value=""
                                                onSelect={() => {
                                                    handleSubmit('brand_code', '');
                                                    setOpen(false);
                                                }}
                                            >
                                                <span className="rounded bg-white p-0.5">
                                                    <AlignLeft size={30} className="stroke-true-primary !size-8 stroke-[1.5]" />
                                                </span>
                                                All Brands
                                                <Check className={cn('ml-auto', value === '' ? 'opacity-100' : 'opacity-0')} />
                                            </CommandItem>
                                            {item_brands?.map((brand) => (
                                                <CommandItem
                                                    key={brand.code}
                                                    value={brand.code}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? '' : currentValue);
                                                        handleSubmit('brand_code', currentValue);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <span className="rounded bg-white p-0.5">
                                                        {brand?.image ? (
                                                            <img
                                                                className="size-8 object-contain"
                                                                src={`/assets/images/item_brands/thumb/${brand?.image}`}
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <span className="size-8 object-contain" />
                                                        )}
                                                    </span>
                                                    <span className="flex flex-1 items-center justify-between">
                                                        {brand?.name} <span className="text-xs">({brand?.items_count})</span>
                                                    </span>
                                                    <Check className={cn('ml-auto', value === brand.code ? 'opacity-100' : 'opacity-0')} />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                )} */}

                {/* End Brands */}

                {/* Body Type */}
                {/* {item_body_types?.length > 0 && (
                    <div className="mt-8">
                        <p className="text-primary mb-2 flex items-center gap-1 text-sm font-semibold">
                            <AlignLeft size={18} /> Body Types
                        </p>
                        <Popover open={openBodyType} onOpenChange={setOpenBodyType}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={openBodyType} className="w-full justify-between">
                                    {valueBodyType
                                        ? (() => {
                                              const selectedBodyType = item_body_types.find((body_type) => body_type.code === valueBodyType);
                                              return selectedBodyType ? (
                                                  <div className="flex items-center gap-2">
                                                      {selectedBodyType.image ? (
                                                          <span className="rounded bg-white p-0.5">
                                                              <img
                                                                  src={`/assets/images/item_body_types/thumb/${selectedBodyType.image}`}
                                                                  alt={selectedBodyType.name}
                                                                  className="size-7 object-contain"
                                                              />
                                                          </span>
                                                      ) : (
                                                          <span className="size-8 object-contain" />
                                                      )}
                                                      {selectedBodyType.name}
                                                  </div>
                                              ) : (
                                                  'Select body_type...'
                                              );
                                          })()
                                        : 'Select body_type...'}

                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search body_type..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No body type found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value=""
                                                onSelect={() => {
                                                    handleSubmit('body_type_code', '');
                                                    setOpen(false);
                                                }}
                                            >
                                                <span className="rounded bg-white p-0.5">
                                                    <AlignLeft size={30} className="stroke-true-primary !size-8 stroke-[1.5]" />
                                                </span>
                                                All Body Types
                                                <Check className={cn('ml-auto', valueBodyType === '' ? 'opacity-100' : 'opacity-0')} />
                                            </CommandItem>
                                            {item_body_types?.map((body_type) => (
                                                <CommandItem
                                                    key={body_type.code}
                                                    value={body_type.code}
                                                    onSelect={(currentValue) => {
                                                        setValueBodyType(currentValue === valueBodyType ? '' : currentValue);
                                                        handleSubmit('body_type_code', currentValue);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <span className="rounded bg-white p-0.5">
                                                        {body_type?.image ? (
                                                            <img
                                                                className="size-8 object-contain"
                                                                src={`/assets/images/item_body_types/thumb/${body_type?.image}`}
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <span className="size-8 object-contain" />
                                                        )}
                                                    </span>
                                                    <span className="flex flex-1 items-center justify-between">
                                                        {body_type?.name} <span className="text-xs">({body_type?.items_count})</span>
                                                    </span>
                                                    <Check
                                                        className={cn('ml-auto', valueBodyType === body_type.code ? 'opacity-100' : 'opacity-0')}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                )} */}

                {/* End Body Type */}

                {/* <Button className="my-8 w-full">Apply Filter</Button> */}

                {/* end filter name */}
            </div>
        </div>
    );
};

export default Filters;
