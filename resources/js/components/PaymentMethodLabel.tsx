import React from 'react';

type PaymentMethod = 'abapay_khqr' | 'abapay_khqr_deeplink' | 'cards' | 'alipay' | 'wechat' | 'google_pay' | string; // fallback for unknown cases

const paymentLabels: Record<string, string> = {
    abapay_khqr: 'ABA KHQR',
    abapay_khqr_deeplink: 'ABA KHQR Deeplink',
    cards: 'Cards',
    alipay: 'Alipay Wallet',
    wechat: 'WeChat Wallet',
    google_pay: 'Google Pay Wallet',
};

interface Props {
    value: PaymentMethod;
}

const PaymentMethodLabel: React.FC<Props> = ({ value }) => {
    return <span>{paymentLabels[value] ?? value}</span>;
};

export default PaymentMethodLabel;
