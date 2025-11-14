import MyStepper from '@/components/my-stepper';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import React from 'react';
import NokorTechLayout from '../layouts/nokor-tech-layout';
import CartItemFormCheckout from './components/CartItemFormCheckout';
import CartItemSummary from './components/CartItemSummary';
const CheckoutPage: React.FC = () => {
    return (
        <NokorTechLayout>
            <div className="mx-auto my-10 max-w-screen-xl px-4">
                <MyStepper steps={['Cart', 'Checkout', 'Complete']} currentStep={1} />
                <div className="flex flex-col gap-12 px-2 lg:flex-row">
                    {/* Shipping Address */}
                    <div className="lg:w-8/12">
                        <CartItemFormCheckout />
                    </div>

                    {/* Order Summary */}
                    <CartItemSummary />
                </div>
            </div>
        </NokorTechLayout>
    );
};

export default CheckoutPage;
