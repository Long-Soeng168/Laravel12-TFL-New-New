import { cn } from '@/lib/utils';
import { MyLanguageSelector } from '@/pages/westec/components/my-select-language';
import { Link } from '@inertiajs/react';
import { AlignLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { HoveredLink, Menu, MenuItem } from './ui/navbar-menu';

export function MyNavbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    return (
        <>
            <div className={cn('mx-auto max-w-[2000px]', className)}>
                <div className="bg-background flex h-full items-center justify-between border-b px-4 py-4 lg:px-16 lg:py-8">
                    <a href="/" className="w-50">
                        <img src="/assets/westec/images/logo.png" />
                    </a>
                    <Button size="icon" variant="outline" className="xl:hidden">
                        <AlignLeftIcon className="stroke-primary stroke-3" />
                    </Button>
                    <div className="hidden xl:block">
                        <Menu setActive={setActive}>
                            <Link prefetch href={`/about`}>
                                <MenuItem setActive={setActive} active={active} item="About Us">
                                    <div className="flex flex-col space-y-4 text-sm">
                                        <HoveredLink href="/about">What is Westec?</HoveredLink>
                                        <HoveredLink href="/about">Why Choose Westec?</HoveredLink>
                                        <HoveredLink href="/about">Vision</HoveredLink>
                                        <HoveredLink href="/about">Our Commitment</HoveredLink>
                                        <HoveredLink href="/about">Our Journey</HoveredLink>
                                    </div>
                                </MenuItem>
                            </Link>

                            <Link prefetch href={`/solutions`}>
                                <MenuItem setActive={setActive} active={active} item="Solutions">
                                    <div className="flex flex-col space-y-4 text-sm">
                                        <HoveredLink href="/solutions">Security & Safety Solutions</HoveredLink>
                                        <HoveredLink href="/solutions">Smart Home & Office Solutions</HoveredLink>
                                        <HoveredLink href="/solutions">Commercial & Residential Equipments</HoveredLink>
                                        <HoveredLink href="/solutions">IT Solutions</HoveredLink>
                                        <HoveredLink href="/solutions">Solution Boosters</HoveredLink>
                                    </div>
                                </MenuItem>
                            </Link>
                            <Link prefetch href={`/case_studies`}>
                                <MenuItem setActive={setActive} active={active} item="Case Studies">
                                    <div className="flex flex-col space-y-4 text-sm">
                                        <HoveredLink href="/case_studies">Banking</HoveredLink>
                                        <HoveredLink href="/case_studies">Microfinance</HoveredLink>
                                        <HoveredLink href="/case_studies">Manufacturing</HoveredLink>
                                        <HoveredLink href="/case_studies">Construction</HoveredLink>
                                        <HoveredLink href="/case_studies">Entertainment</HoveredLink>
                                    </div>
                                </MenuItem>
                            </Link>

                            <Link prefetch href={`/#partners`}>
                                <MenuItem setActive={setActive} active={active} item="Partners">
                                    <div className="flex flex-col space-y-4 text-sm">
                                        <HoveredLink href="/#partners">Our Partners</HoveredLink>
                                    </div>
                                </MenuItem>
                            </Link>

                            <Link prefetch href={`/career`}>
                                <MenuItem setActive={setActive} active={active} item="Career">
                                    <div className="flex flex-col space-y-4 text-sm">
                                        <HoveredLink href="/career">Employee Highlight</HoveredLink>
                                        <HoveredLink href="/career">Career</HoveredLink>
                                    </div>
                                </MenuItem>
                            </Link>

                            <Link prefetch href={`/#newsId`}>
                                <MenuItem setActive={setActive} active={active} item="News">
                                    <div className="flex flex-col space-y-4 text-sm">
                                        <HoveredLink href="/#newsId">News & Updates</HoveredLink>
                                        <HoveredLink href="/#eventsId">Events & Promotions</HoveredLink>
                                    </div>
                                </MenuItem>
                            </Link>

                            <Link prefetch href={`/contact`}>
                                <MenuItem setActive={setActive} active={active} item="Contact Us">
                                    <div className="flex flex-col space-y-4 text-sm">
                                        <HoveredLink href="/contact">Project Inquiry?</HoveredLink>
                                        <HoveredLink href="/contact">Get Support?</HoveredLink>
                                        <HoveredLink href="/contact">Location (Map)</HoveredLink>
                                    </div>
                                </MenuItem>
                            </Link>

                            <div>
                                <MyLanguageSelector />
                            </div>
                        </Menu>
                    </div>
                </div>
            </div>
        </>
    );
}
