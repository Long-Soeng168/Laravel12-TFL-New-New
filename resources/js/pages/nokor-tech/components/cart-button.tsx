import { useCart } from '@/contexts/cart-contexts';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { CartSheet } from '../cart/components/CartSheet';

const CartButton = () => {
    const [openCartDialog, setOpeCartDialog] = useState(false);
    const { cartItems } = useCart();
    return (
        <>
            <CartSheet openCartDialog={openCartDialog} setOpeCartDialog={setOpeCartDialog} />
            <button
                onClick={() => setOpeCartDialog(true)}
                className="hover:bg-secondary bg-accent hover:border-primary border-accent relative flex cursor-pointer items-center justify-start gap-2 rounded-md border px-2 py-2"
            >
                <ShoppingCart className="h-5 w-5" />
                {cartItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                        {cartItems.length}
                    </span>
                )}
            </button>
        </>
    );
};

export default CartButton;
