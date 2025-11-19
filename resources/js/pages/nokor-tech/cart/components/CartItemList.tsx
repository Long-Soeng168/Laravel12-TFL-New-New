import MyNoData from '@/components/my-no-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/cart-contexts';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
import ClearCartButton from './ClearCartButton';

const CartItemList = () => {
    const { cartItems, handleQuantityChange, removeFromCart } = useCart();
    const { SHIPPING_PRICE_USD } = usePage<any>().props;
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
    const shipping = SHIPPING_PRICE_USD || 0;

    const total = subtotal + shipping;

    const { t } = useTranslation();
    return (
        <div>
            <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Main Cart Section */}
                    <div className="space-y-6 lg:col-span-7">
                        <div>
                            <h1 className="text-2xl font-semibold">{t('Shopping Cart')}</h1>
                            <p className="text-muted-foreground">
                                {cartItems.length} {t('items in your cart')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {cartItems?.length > 0 &&
                                cartItems.map((item) => (
                                    <Card key={item.id} className="overflow-hidden p-0">
                                        <CardContent className="p-0">
                                            <div className="flex h-full flex-row md:flex-row">
                                                {/* Product Image */}
                                                <div className="relative aspect-square h-auto w-[25%] md:w-32">
                                                    <img
                                                        src={`/assets/images/items/thumb/${item?.images[0]?.image}`}
                                                        alt={item.name}
                                                        width={500}
                                                        height={500}
                                                        className="h-full w-full object-cover md:w-32"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 p-4 pb-3 md:p-6">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h3 className="line-clamp-3 font-medium">{item.name}</h3>
                                                            {/* <p className="text-muted-foreground text-sm">
                                                            {item.color} • {item.size}
                                                        </p> */}
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item)}>
                                                            <Trash2 className="stroke-destructive h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item?.id, -1)}>
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="w-8 text-center">{item.cartQuantity}</span>
                                                            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item?.id, +1)}>
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="font-medium">${(item.price * item.cartQuantity).toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                        {cartItems?.length > 0 ? (
                            <div className="mt-6 flex justify-between">
                                <ClearCartButton />
                                {/* <div className="space-x-4">
                        <a href="/checkout">
                            <Button>Checkout</Button>
                        </a>
                    </div> */}
                            </div>
                        ) : (
                            <MyNoData />
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6 lg:col-span-5">
                        <Card className="m-0 p-4 md:p-6">
                            <CardHeader className="m-0 p-0">
                                <CardTitle>{t('Order Summary')}</CardTitle>
                                <CardDescription>{t('Review your order details and shipping information')}</CardDescription>
                            </CardHeader>
                            <CardContent className="m-0 space-y-6 p-0">
                                {/* Order Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>{t('Subtotal')}</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>{t('Shipping')}</span>
                                        <span>${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                        <span>{t('Total')}</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                {cartItems?.length > 0 && <CheckoutButton />}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemList;
