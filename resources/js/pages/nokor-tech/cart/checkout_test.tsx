import { useEffect, useState } from 'react';
import NokorTechLayout from '../layouts/nokor-tech-layout';

const PayPalPayment = () => {
    const [amount, setAmount] = useState(1);
    const [successVisible, setSuccessVisible] = useState(false);

    // Load PayPal SDK script dynamically
    useEffect(() => {
        const script = document.createElement('script');
        script.src =
            'https://www.paypal.com/sdk/js?client-id=AaMd6DJgL7L5WBdugs3t5Iv1XYI7oUrH_bSdd7zpfnyZQCXjwEBiHPiVY90gpWvUvH4-76-jBNff45Mq&currency=USD&intent=capture';
        script.addEventListener('load', () => initPayPalButton());
        document.body.appendChild(script);
    }, [amount]);

    const initPayPalButton = () => {
        if (!window.paypal) return;

        window.paypal
            .Buttons({
                createOrder: () =>
                    fetch(`/api/create/${amount}`)
                        .then((res) => res.text())
                        .then((id) => id),

                onApprove: () =>
                    fetch('/api/complete', {
                        method: 'POST',
                        headers: {
                            'X-CSRF-Token': import.meta.env.VITE_CSRF_TOKEN,
                        },
                    })
                        .then((res) => res.json())
                        .then(() => {
                            setSuccessVisible(true);
                            console.log('success pay');
                        })
                        .catch((err) => console.error(err)),

                onCancel: (data) => console.log('Payment cancelled:', data),
                onError: (err) => console.error('PayPal error:', err),
            })
            .render('#payment_options');
    };

    return (
        <NokorTechLayout>
            <div className="mx-auto max-w-xl px-6 py-12 text-center">
                <h1 className="mb-6 text-3xl font-bold">PayPal Laravel (React)</h1>

                <div className="mb-6 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700">
                    <strong className="mb-2 block text-lg">⚠️ WARNING!!!</strong>
                    <p>
                        This is set to <span className="font-semibold">LIVE mode</span>, so real money is used.
                        <br />
                        No refunds, use at your own risk.
                    </p>
                </div>

                {successVisible && (
                    <div className="mb-6 rounded-lg border border-green-300 bg-green-100 p-4 text-green-800">
                        ✅ You have successfully sent me money! Thank you!
                    </div>
                )}

                <div className="mb-6 flex items-center gap-2">
                    <span className="text-lg font-medium">£</span>
                    <input
                        type="number"
                        className="w-24 rounded-md border px-3 py-2 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={amount}
                        min="1"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <span className="text-lg font-medium">.00</span>
                </div>

                <div id="payment_options" className="flex justify-center"></div>
            </div>
        </NokorTechLayout>
    );
};

export default PayPalPayment;
