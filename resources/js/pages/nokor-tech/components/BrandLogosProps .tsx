import React from 'react';

interface Logo {
    src: string;
    alt: string;
    width?: number;
}

interface BrandLogosProps {
    logos: Logo[];
    className?: string;  // Optional className prop for custom Tailwind classes
}

const BrandLogos: React.FC<BrandLogosProps> = ({ logos, className }) => {
    return (
        <div
            className={`${className}`}
        >
            {logos.map((logo, index) => (
                <img key={index} src={logo.src} alt={logo.alt} width={logo.width || 120} />
            ))}
        </div>
    );
};

export default BrandLogos;
