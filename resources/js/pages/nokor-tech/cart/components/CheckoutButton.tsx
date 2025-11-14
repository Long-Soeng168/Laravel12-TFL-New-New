import MyLoadingAnimationOne from '@/components/MyLoadingAnimationOne';
import { useCart } from '@/contexts/cart-contexts';
import useTranslation from '@/hooks/use-translation';
import { router, useForm, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CheckoutButton = () => {
    // console.log(usePage<any>().props);
    const { req_time, shipping, currency, paymentOption, tran_id } = usePage<any>().props;

    const [error, setError] = useState('');

    const { post, progress, processing, transform, errors } = useForm();

    const [isLoading, setIsLoading] = useState(false);

    const { cartItems, clearCart } = useCart();
    const cartItemsSubmit =
        cartItems?.map((item: any) => {
            const itemPrice = parseFloat(item.price);
            const discount_percent = parseFloat(item.discount_percent);
            const discountAmount = (itemPrice * discount_percent) / 100;

            const itemTotal = (itemPrice - (discount_percent ? discountAmount : 0)) * item.cartQuantity;

            return {
                item_id: item.id,
                item_name: item.name,
                price: itemPrice,
                discount_percent: discount_percent,
                quantity: item.cartQuantity,
                sub_total: itemTotal,
            };
        }) || [];
    const total_amount = +cartItemsSubmit.reduce((sum, item) => sum + item.sub_total, 0);

    const handleCheckout = () => {
        if (typeof window === 'undefined') return; // safety no-op on server

        const orderData = {
            shop_id: cartItems[0]?.shop_id || null,
            note: '',
            total_amount: +total_amount + shipping,
            payment_method: paymentOption,
            currency: currency,
            tran_id: tran_id,
            req_time: req_time,
            shipping_price: shipping,
            shipping_lat: 0.0,
            shipping_lng: 0.0,
            items: cartItemsSubmit,
        };

        transform(() => orderData);
        post(`/orders`, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                if (page.props.flash?.success && page.props.flash?.order_id) {
                    clearCart();
                    router.visit(`/user-orders/${page.props.flash?.order_id}`, {
                        replace: true,
                    });
                }
            },
            onError: (e) => {
                toast.error('Error', {
                    description: 'Failed to create.' + JSON.stringify(e, null, 2),
                });
            },
            onFinish: () => {
                setIsLoading(false);
                console.log('Finally!');
            },
        });
    };

    const { t } = useTranslation();

    return (
        <div className="container">
            <>
                <button
                    id="checkout_button"
                    disabled={isLoading}
                    onClick={async () => {
                        await setIsLoading(true);
                        handleCheckout();
                    }}
                    className="transistion rainbow-btn relative inline-flex h-12 w-full overflow-hidden rounded-[12px] p-[3px] duration-300 hover:scale-105 focus:outline-none active:scale-95"
                >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#fff_0%,#f472b6_90%,#bd5fff_100%)]"></span>
                    <span className="undefined bg-true-primary inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-7 text-sm font-medium text-white backdrop-blur-3xl">
                        <div className="flex w-full items-center justify-between">
                            <div className="flex-1 font-semibold">{t('Checkout')}</div>
                            <span className="flex cursor-pointer items-center justify-center rounded-[4px] bg-transparent p-1">
                                <ChevronRight className="stroke-white" />
                            </span>
                        </div>
                    </span>
                </button>
            </>
            {isLoading && <MyLoadingAnimationOne />}
        </div>
    );
};

export default CheckoutButton;
