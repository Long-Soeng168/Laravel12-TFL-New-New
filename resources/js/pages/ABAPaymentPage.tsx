import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';

function ABAPaymentPage() {
    const [qrString, setQrString] = useState(null);
    const [result, setResult] = useState(null);

    const handlePayment = async () => {
        try {
            const { data } = await axios.get('/checkout_aba');

            if (data.status.code === '00') {
                setQrString(data.qrString);
                setResult(data);
            } else {
                alert('Failed: ' + data.status.message);
            }
        } catch (error) {
            console.error(error);
            alert('Payment request failed.');
        }
    };

    return (
        <div>
            <Button onClick={handlePayment}>Pay Now</Button>

            {qrString && (
                <div className="mt-4">
                    <h3 className="mb-2 text-lg font-semibold">Scan to Pay:</h3>
                    <img
                        src={`${result.qrImage}`}
                        alt="ABA QR Code"
                        className="mb-2"
                    />
                    <p>
                        <strong>qrString:</strong> {result.qrString}
                    </p>
                    <p>
                        <strong>description:</strong> {result.description}
                    </p>
                    <p>
                        <strong>abapay_deeplink:</strong> {result.abapay_deeplink}
                    </p>
                    <a href={result.abapay_deeplink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                        Open ABA Mobile App
                    </a>
                </div>
            )}
        </div>
    );
}

export default ABAPaymentPage;
