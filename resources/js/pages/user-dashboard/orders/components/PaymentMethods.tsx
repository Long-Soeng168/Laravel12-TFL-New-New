import MyLoadingAnimationOne from '@/components/MyLoadingAnimationOne';
import { BorderBeam } from '@/components/ui/border-beam';
import useTranslation from '@/hooks/use-translation';
import { useForm, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const PaymentMethods = () => {
    // console.log(usePage<any>().props);
    const {
        api_url,
        hash,
        tran_id,
        amount,
        shipping,
        email,
        payment_option,
        merchant_id,
        req_time,
        return_url,
        continue_success_url,
        skip_success_page,
        currency,
    } = usePage<any>().props;

    const [error, setError] = useState('');

    const { post, progress, processing, transform, errors } = useForm();

    const [paywayReady, setPaywayReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const startTransactionPolling = () => {
        // console.log(AbaPayway);
        if (!tran_id) return;

        let elapsed = 0;
        const interval = 10000; // 10s
        const maxTime = 5 * 60 * 1000; // 5 min

        const checkTransaction = async () => {
            elapsed += interval;

            if (elapsed > maxTime) {
                console.log('QR expired, stop timer');
                toast.warning('Warning', {
                    description: 'QR expired',
                });
                AbaPayway.closeCheckout();
                return;
            }

            console.log(`Checking transaction... elapsed: ${elapsed / 1000}s`);
            await handleRecheck();

            setTimeout(checkTransaction, interval);
        };

        checkTransaction(); // start polling
    };

    const handleRecheck = async () => {
        try {
            const response = await fetch(`/aba/callback?tran_id=${tran_id}`, {
                method: 'GET', // or POST if your callback expects POST
                headers: {
                    Accept: 'application/json',
                },
            });

            const data = await response.json();

            if (data.response) {
                console.log(JSON.stringify(data?.response?.payment_status, null, 2));
                console.log('Transaction rechecked successfully');
            }
        } catch (err: any) {
            console.error(err.message || 'Something went wrong while rechecking');
        } finally {
            // router.reload();
        }
    };

    const handleCheckout = () => {
        console.log('hash : ' + hash);
        if (typeof window === 'undefined') return; // safety no-op on server

        if (paywayReady) {
            setIsLoading(false);
            AbaPayway.checkout();
            startTransactionPolling(); // ✅ start polling after showing QR
        } else {
            alert('Payment system not loaded yet, please wait.');
        }
    };

    const { t } = useTranslation();

    return (
        <div className="container">
            <div className={'text-primary mb-4 text-lg leading-none font-bold'}>
                <p>{t('Choose Payment Method')}</p>
            </div>
            {/* <h2 className="my-4">TOTAL(Testing): ${amount}</h2> */}
            <div className="prose">
                <form method="POST" target="aba_webservice" action={api_url} id="aba_merchant_request">
                    <input type="hidden" name="hash" value={hash} id="hash" />
                    <input type="hidden" name="req_time" value={req_time} />
                    <input type="hidden" name="merchant_id" value={merchant_id} />
                    <input type="hidden" name="tran_id" value={tran_id} id="tran_id" />
                    <input type="hidden" name="amount" value={amount} id="amount" />
                    <input type="hidden" name="shipping" value={shipping} id="shipping" />
                    <input type="hidden" name="email" value={email} />
                    <input type="hidden" name="payment_option" value={payment_option} />
                    <input type="hidden" name="return_url" value={return_url} />
                    <input type="hidden" name="continue_success_url" value={continue_success_url} />
                    <input type="hidden" name="skip_success_page" value={skip_success_page} />
                </form>
            </div>

            {paywayReady ? (
                <div className="relative">
                    <button
                        id="checkout_button"
                        onClick={async () => {
                            await setIsLoading(true);
                            handleCheckout();
                        }}
                        disabled={!paywayReady}
                        className="bg-background relative flex w-full cursor-pointer items-center gap-[10px] rounded-[8px] border border-transparent p-[6px] text-start shadow-[0_1px_5px_rgb(0,0,0,0.1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:p-[10px] dark:bg-white/20 dark:hover:bg-white/25"
                    >
                        <img className="size-[40px] rounded-[4px]" src="/assets/ABA_BANK.svg" alt="" />
                        <div className="flex w-full items-center justify-between">
                            <div className="flex-1">
                                <p className="text-[16px] font-semibold">ABA KHQR</p>
                                <p className="text-[12px] font-normal text-gray-600 dark:text-gray-200">Scan to pay with any banking app</p>
                            </div>
                            <span className="bg-accent flex cursor-pointer items-center justify-center rounded-[6px] p-1 dark:bg-white/10">
                                <ChevronRight size={18} className="translate-x-[1px] stroke-gray-600 dark:stroke-gray-200" />
                            </span>
                        </div>
                        <BorderBeam duration={6} size={100} />
                    </button>
                </div>
            ) : (
                <MyLoadingAnimationOne />
            )}
            {error && <p className="text-red-500">{error}</p>}
            {isLoading && <MyLoadingAnimationOne />}
        </div>
    );
};

export default PaymentMethods;
