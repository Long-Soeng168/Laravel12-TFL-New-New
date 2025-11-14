import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-contexts';
import useTranslation from '@/hooks/use-translation';
import { router } from '@inertiajs/react';
import { CheckIcon, ShoppingBagIcon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';
import { DifferenceShopDialog } from '../cart/components/DifferenceShopDialog';

function AddToCart({ item }: { item: any }) {
    const { addToCart, cartItems } = useCart();
    const [added, setAdded] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    // console.log(cartItems);

    const handleAddToCart = () => {
        if (cartItems?.length > 0 && item?.shop_id != cartItems[0]?.shop_id) {
            setOpenDialog(true);
            // console.log('shop diff');
        } else {
            // console.log('Shop the same');
            addToCart(item);
            setAdded(true);

            // Reset after 2.5 seconds
            setTimeout(() => {
                setAdded(false);
            }, 2500);
        }
    };
    const handleBuyNow = () => {
        if (cartItems?.length > 0 && item?.shop_id != cartItems[0]?.shop_id) {
            setOpenDialog(true);
            // console.log('shop diff');
        } else {
            // console.log('Shop the same');
            addToCart(item);
            router.get('/shopping-cart');
        }
    };

    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-2">
            <DifferenceShopDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
            <Button
                onClick={handleAddToCart}
                size="lg"
                variant={added ? 'default' : 'outline'}
                className={added ? 'bg-green-500 text-white hover:bg-green-600' : ''}
            >
                {added ? <CheckIcon className="mr-2" /> : <ShoppingCartIcon className="mr-2" />}
                {added ? t('Added!') : t('Add To Cart')}
            </Button>

            <Button onClick={handleBuyNow} size="lg">
                <ShoppingBagIcon className="mr-2" />
                {t('Buy Now')}
            </Button>
        </div>
    );
}

export default AddToCart;
