import MyLoadingAnimationOne from '@/components/MyLoadingAnimationOne';
import { BorderBeam } from '@/components/ui/border-beam';
import useTranslation from '@/hooks/use-translation';
import { useForm, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

const KESSPaymentMethods = () => {
    // console.log(usePage<any>().props);
    const { paymentLink } = usePage<any>().props;

    if (!paymentLink) return null;

    const [error, setError] = useState('');

    const { post, progress, processing, transform, errors } = useForm();

    const [paywayReady, setPaywayReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();

    return (
        <div className="container">
            <div className={'text-primary mb-4 text-lg leading-none font-bold'}>
                <p>{t('Choose Payment Method')}</p>
            </div>

            <a href={paymentLink} className="relative">
                <button className="bg-background relative flex w-full cursor-pointer items-center gap-[10px] rounded-[8px] border border-transparent p-[6px] text-start shadow-[0_1px_5px_rgb(0,0,0,0.1)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:p-[10px] dark:bg-white/20 dark:hover:bg-white/25">
                    <img className="size-[40px] rounded-[4px]" src="/assets/icons/cards.png" alt="" />
                    <div className="flex w-full items-center justify-between">
                        <div className="flex-1">
                            <p className="text-[16px] font-semibold">Credit/Debit Card</p>
                            <div className="flex gap-1">
                                <img className="h-4" src="/assets/icons/visa.png" alt="" />
                                <img className="h-4" src="/assets/icons/master.png" alt="" />
                            </div>
                            {/* <p className="text-[12px] font-normal text-gray-600 dark:text-gray-200">Scan to pay with any banking app</p> */}
                        </div>
                        <span className="bg-accent flex cursor-pointer items-center justify-center rounded-[6px] p-1 dark:bg-white/10">
                            <ChevronRight size={18} className="translate-x-[1px] stroke-gray-600 dark:stroke-gray-200" />
                        </span>
                    </div>
                    <BorderBeam duration={6} size={100} />
                </button>
            </a>

            {error && <p className="text-red-500">{error}</p>}
            {isLoading && <MyLoadingAnimationOne />}
        </div>
    );
};

export default KESSPaymentMethods;
