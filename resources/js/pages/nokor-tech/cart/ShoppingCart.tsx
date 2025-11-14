import NokorTechLayout from '../layouts/nokor-tech-layout';
import { CancelDialog } from './components/CancelDialog';
import CartItemList from './components/CartItemList';
import { OrderFailDialog } from './components/OrderFailDialog';
import { OrderSuccessDialog } from './components/OrderSuccessDialog';

export default function ShoppingCart() {
    return (
        <NokorTechLayout>
            <CancelDialog />
            <OrderSuccessDialog />
            <OrderFailDialog />
            <CartItemList />
            <div className="h-20" />
        </NokorTechLayout>
    );
}
