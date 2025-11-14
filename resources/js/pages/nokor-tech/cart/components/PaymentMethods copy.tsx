import MyLoadingAnimationOne from '@/components/MyLoadingAnimationOne';
import { usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const PaymentMethods = () => {
    console.log(usePage<any>().props);
    const {
        req_time,
        merchant_id,
        tran_id,
        amount,
        items,
        shipping,
        firstname,
        lastname,
        email,
        phone,
        type,
        payment_option,
        return_url,
        cancel_url,
        continue_success_url,
        return_deeplink,
        currency,
        custom_fields,
        return_params,
        payout,
        lifetime,
        additional_params,
        google_pay_token,
        skip_success_page,
        hash,
        api_url,
    } = usePage<any>().props;

    const [paywayReady, setPaywayReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return; // no-op on server
        // Dynamically load the script only once
        if (!document.getElementById('aba-payway-script')) {
            const script = document.createElement('script');
            script.id = 'aba-payway-script';
            script.src = 'https://checkout.payway.com.kh/plugins/checkout2-0.js';
            script.async = true;
            document.body.appendChild(script);
        }

        const checkAbaPayway = () => {
            console.log('aba-payway-script fetching...');
            // safe check on client only
            if (typeof AbaPayway === 'object') {
                setPaywayReady(true);
                console.log(AbaPayway);
            } else {
                setTimeout(checkAbaPayway, 300);
            }
        };
        checkAbaPayway();
    }, []);

    const handleCheckout = () => {
        if (typeof window === 'undefined') return; // safety no-op on server
        if (paywayReady) {
            AbaPayway.checkout();
        } else {
            alert('Payment system not loaded yet, please wait.');
        }
    };

    return (
        <div className="container">
            <div className={'text-primary mb-4 text-lg leading-none font-bold'}>
                <p>Choose Payment Method</p>
            </div>
            <h2 className="my-4">TOTAL(Testing): ${amount}</h2>
            <form method="POST" target="aba_webservice" action={api_url} id="aba_merchant_request">
                <input type="hidden" name="req_time" value={req_time} />
                <input type="hidden" name="merchant_id" value={merchant_id} />
                <input type="hidden" name="tran_id" value={tran_id} />
                <input type="hidden" name="amount" value={amount} />
                <input type="hidden" name="items" value={items} />
                <input type="hidden" name="shipping" value={shipping} />
                <input type="hidden" name="firstname" value={firstname} />
                <input type="hidden" name="lastname" value={lastname} />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="phone" value={phone} />
                <input type="hidden" name="type" value={type} />
                <input type="hidden" name="payment_option" value={payment_option} />
                <input type="hidden" name="return_url" value={return_url} />
                <input type="hidden" name="cancel_url" value={cancel_url} />
                <input type="hidden" name="continue_success_url" value={continue_success_url} />
                <input type="hidden" name="return_deeplink" value={return_deeplink} />
                <input type="hidden" name="currency" value={currency} />
                <input type="hidden" name="custom_fields" value={custom_fields} />
                <input type="hidden" name="return_params" value={return_params} />
                <input type="hidden" name="payout" value={payout} />
                <input type="hidden" name="lifetime" value={lifetime} />
                <input type="hidden" name="additional_params" value={additional_params} />
                <input type="hidden" name="google_pay_token" value={google_pay_token} />
                <input type="hidden" name="skip_success_page" value={skip_success_page} />
                <input type="hidden" name="hash" value={hash} />
            </form>

            {paywayReady ? (
                <button
                    id="checkout_button"
                    onClick={handleCheckout}
                    disabled={!paywayReady}
                    className="bg-background flex w-full cursor-pointer items-center gap-[10px] rounded-[8px] border border-transparent p-[10px] text-start shadow-[0_1px_5px_rgb(0,0,0,0.1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-white/20 dark:hover:bg-white/25"
                >
                    <img className="size-[50px] rounded-[4px]" src="/assets/ABA_BANK.svg" alt="" />
                    <div className="flex w-full items-center justify-between">
                        <div className="flex-1">
                            <p className="text-[16px] font-semibold">ABA KHQR</p>
                            <p className="text-[14px] font-normal text-gray-600 dark:text-gray-200">Scan to pay with any banking app</p>
                        </div>
                        <span className="bg-accent flex cursor-pointer items-center justify-center rounded-[4px] p-1 dark:bg-white/10">
                            <ChevronRight className="stroke-gray-600 dark:stroke-gray-200" />
                        </span>
                    </div>
                </button>
            ) : (
                <MyLoadingAnimationOne />
            )}
        </div>
    );
};

export default PaymentMethods;
