import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/cart-contexts';
import useTranslation from '@/hooks/use-translation';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

const FormField: React.FC<{
    label: string;
    required?: boolean;
    children: React.ReactNode;
}> = ({ label, required, children }) => (
    <div className="mb-4 text-sm">
        <p className="text-foreground mb-1 font-semibold">
            {label} {required && <span className="text-red-500">*</span>}
        </p>
        {children}
    </div>
);

const CartItemFormCheckout = () => {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const { cartItems, clearCart } = useCart();
    const cartItemTotals =
        cartItems?.map((item) => {
            const itemPrice = parseFloat(item.price);
            const itemDiscount = parseFloat(item.discount);
            const discountAmount = item.discount_type === 'percentage' ? (itemPrice * itemDiscount) / 100 : itemDiscount;

            const itemTotal = (itemPrice - (itemDiscount ? discountAmount : 0)) * item.cartQuantity;

            return {
                item_id: item.id,
                price: itemPrice,
                discount: itemDiscount,
                discount_type: item.discount_type,
                quantity: item.cartQuantity,
                total: itemTotal,
            };
        }) || [];

    const orderTotal = cartItemTotals.reduce((sum, item) => sum + item.total, 0);

    const { data, setData, post, processing, errors } = useForm({
        name: auth?.user?.name || '',
        phone: auth?.user?.phone || '',
        note: '',
        total: orderTotal,
        items: cartItemTotals,
    });

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        post('/orders', {
            onSuccess: (page) => {
                if (page.props.flash?.success) {
                    clearCart(false);
                    router.visit('/checkout_success');

                    // toast.success('Success', {
                    //     description: page.props.flash.success,
                    // });
                }
                if (page.props.flash?.error) {
                    toast.error('Error', {
                        description: page.props.flash.error,
                    });
                }
            },
            onError: (e) => {
                toast.error('Error', {
                    description: 'Failed to create.' + JSON.stringify(e, null, 2),
                });
            },
        }); // your Laravel route
    };

    return (
        <>
            <div>
                <FormField label="Name" required>
                    <input
                        type="text"
                        placeholder="Name"
                        autoComplete="name"
                        name="name"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="bg-muted w-full rounded-md border px-4 py-2"
                    />
                    {errors?.name && <p className="text-red-400">{errors?.name}</p>}
                </FormField>
                <FormField label="Phone Number" required>
                    <input
                        type="text"
                        placeholder="Phone"
                        autoComplete="phone"
                        name="phone"
                        required
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="bg-muted w-full rounded-md border px-4 py-2"
                    />
                    {errors?.phone && <p className="text-red-400">{errors?.phone}</p>}
                </FormField>
                <FormField label="Note">
                    <Textarea
                        id="note"
                        autoComplete="note"
                        name="note"
                        className="bg-muted"
                        placeholder="Note"
                        value={data.note}
                        onChange={(e) => setData('note', e.target.value)}
                    />
                    {errors?.note && <p className="text-red-400">{errors?.note}</p>}
                </FormField>
                {errors?.general && <p className="text-red-400">{errors?.general}</p>}
            </div>
            <div className="flex justify-between">
                <Link href="/shopping-cart" prefetch className="flex justify-end">
                    <Button variant="outline">Back</Button>
                </Link>
                <Button onClick={handleSubmit} disabled={processing}>
                    {processing && (
                        <span className="size-6 animate-spin">
                            <Loader />
                        </span>
                    )}
                    {processing ? t('Placing Order') : t('Place Order')}
                </Button>
            </div>
        </>
    );
};

export default CartItemFormCheckout;
