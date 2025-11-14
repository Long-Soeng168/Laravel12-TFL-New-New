import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button'; // adjust path
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'; // adjust path

interface Category {
    id?: string | number;
    value?: string;
    label?: string;
    name?: string;
}

interface CategoriesHoverCardProps {
    categories?: Category[];
}

const CategoriesHoverCard: React.FC<CategoriesHoverCardProps> = ({ categories = [] }) => {
    if (categories.length === 0) return <div>---</div>;

    return (
        <div className='flex flex-wrap items-center gap-1'>
            {/* Show first 2 badges */}
            {categories.slice(0, 2).map((cat) => (
                <Badge key={cat.id ?? cat.value ?? cat.label} variant="outline" className='h-8'>
                    {cat?.image && (
                        <img
                            src={`/assets/images/item_categories/thumb/${cat?.image}`}
                            alt={`Category ${cat?.name}`}
                            className="size-full object-contain transition-transform duration-300 group-hover:scale-115"
                        />
                    )}
                    {cat.name ?? cat.label ?? 'Verified'}
                </Badge>
            ))}

            {/* Show HoverCard trigger only if more than 2 */}
            {categories.length > 2 && (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Badge variant="secondary" className='h-8 text-primary cursor-pointer'>
                            +{categories.length - 2} more
                        </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="max-h-48 w-80 overflow-auto">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <Badge key={cat.id ?? cat.value ?? cat.label} variant="outline">
                                    {cat?.image && (
                                        <img
                                            src={`/assets/images/item_categories/thumb/${cat?.image}`}
                                            alt={`Category ${cat?.name}`}
                                            className="size-6 object-contain transition-transform duration-300 group-hover:scale-115"
                                        />
                                    )}
                                    {cat.name ?? cat.label ?? 'Verified'}
                                </Badge>
                            ))}
                        </div>
                    </HoverCardContent>
                </HoverCard>
            )}
        </div>
    );
};

export default CategoriesHoverCard;
