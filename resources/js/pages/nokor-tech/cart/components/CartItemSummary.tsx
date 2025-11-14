import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCart } from '@/contexts/cart-contexts';
import { Link } from '@inertiajs/react';

const formatCurrency = (value) => `$${parseFloat(value).toFixed(2)}`;

const CartItemSummary = () => {
    const { cartItems } = useCart();

    // Compute subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

    // Assuming no extra fees/discounts, total = subtotal for now
    const total = subtotal;

    return (
        <div className="bg-muted rounded-md p-6 shadow-sm lg:w-4/12">
            <h2 className="mb-6 text-xl font-bold">Summary</h2>

            <Accordion type="single" collapsible defaultValue='item-1'>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm font-semibold">Oneline Trainings</AccordionTrigger>
                    <AccordionContent className="text-sm">
                        <table className="w-full">
                            <tbody>
                                {cartItems.map((product) => (
                                    <tr key={`summary-${product?.id}`}>
                                        <td>
                                            <Link href={`/products/${product?.id}`} className="flex items-center p-2">
                                                {product?.images?.length > 0 && (
                                                    <img
                                                        src={`/assets/images/items/thumb/${product?.images[0]?.image}`}
                                                        alt=""
                                                        className="mr-2 aspect-square size-14 rounded object-cover"
                                                    />
                                                )}

                                                <p className="line-clamp-3 hover:underline">{product?.name}</p>
                                            </Link>
                                        </td>
                                        <td className="p-2">{formatCurrency(product?.price)}</td>
                                        <td className="p-2 text-center text-lg">x{product?.cartQuantity}</td>
                                        <td className="p-2">{formatCurrency(product?.price * product?.cartQuantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="mt-6 space-y-2 pt-4">
                {/* <div className="flex justify-between text-sm">
                    <p>Subtotal</p>
                    <p>{formatCurrency(subtotal)}</p>
                </div> */}
                <div className="flex justify-between text-lg font-bold">
                    <p>Total</p>
                    <p>{formatCurrency(total)}</p>
                </div>
            </div>
        </div>
    );
};

export default CartItemSummary;
