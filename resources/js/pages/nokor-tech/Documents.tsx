import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';
import NokorTechLayout from './layouts/nokor-tech-layout';
import HeroDocuments from './components/hero-documents';

const Documents = () => {
    const plans = [
        {
            name: '6 Months',
            price: 5,
            description: 'Get full access to all car brand documents for 6 months with regular updates.',
            features: [
                { title: 'Access to all car brands' },
                { title: 'Unlimited document downloads' },
                { title: 'Priority support' },
                { title: 'Free updates for 6 months' },
            ],
            buttonText: 'Subscribe for 6 Months',
        },
        {
            name: '12 Months',
            price: 9,
            isRecommended: true,
            isPopular: true,
            description: 'Enjoy a full year of unlimited access to every car brand`s documents, with priority support and updates.',
            features: [
                { title: 'Access to all car brands' },
                { title: 'Unlimited document downloads' },
                { title: 'Priority support' },
                { title: 'Free updates for 12 months' },
            ],
            buttonText: 'Subscribe for 12 Months',
        },
        {
            name: '24 Months',
            price: 16,
            description: 'Access all car brand documents for 2 full years with unlimited downloads and premium support.',
            features: [
                { title: 'Access to all car brands' },
                { title: 'Unlimited document downloads' },
                { title: 'Premium priority support' },
                { title: 'Free updates for 24 months' },
            ],
            buttonText: 'Subscribe for 24 Months',
        },
    ];

    return (
        <NokorTechLayout>
            <div className="my-10 mx-2">
                <HeroDocuments />
                <h1 id='pricing' className="scroll-mt-28 text-center text-5xl font-bold tracking-tight">Pricing</h1>
                <div className="mx-auto mt-12 grid max-w-screen-lg grid-cols-1 items-center gap-8 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn('relative rounded-lg border p-6', {
                                'border-primary border-[2px] py-10': plan.isPopular,
                            })}
                        >
                            {plan.isPopular && <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">Most Popular</Badge>}
                            <h3 className="text-lg font-medium">{plan.name}</h3>
                            <p className="mt-2 text-4xl font-bold">${plan.price}</p>
                            <p className="text-muted-foreground mt-4 font-medium">{plan.description}</p>
                            <Separator className="my-4" />
                            <ul className="space-y-2">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <CircleCheck className="mt-1 h-4 w-4 text-green-600" />
                                        {feature.title}
                                    </li>
                                ))}
                            </ul>
                            <Button variant={plan.isPopular ? 'default' : 'outline'} size="lg" className="mt-6 w-full">
                                {plan.buttonText}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </NokorTechLayout>
    );
};

export default Documents;
