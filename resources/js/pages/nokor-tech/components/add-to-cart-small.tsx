import { MyTooltipButton } from '@/components/my-tooltip-button';
import { useCart } from '@/contexts/cart-contexts';
import { cn } from '@/lib/utils';
import { CheckIcon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';

function AddToCartSmall({ item }: { item: any }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(item);
        setAdded(true);

        // Reset back to cart icon after 1.5s
        setTimeout(() => {
            setAdded(false);
        }, 2500);
    };

    return (
        <div>
            <MyTooltipButton
                title={added ? 'Added!' : 'Add to cart'}
                onClick={handleAddToCart}
                className={cn(
                    'group border-primary relative w-10 cursor-pointer overflow-hidden rounded-lg border p-2 text-center font-semibold',
                    added ? 'text-green-500 hover:text-green-500' : 'bg-white text-black',
                )}
            >
                {added ? <CheckIcon size={18} /> : <ShoppingCartIcon size={18} />}
            </MyTooltipButton>
        </div>
    );
}

export default AddToCartSmall;
