import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Undo2Icon } from 'lucide-react';
import NokorTechLayout from '../layouts/nokor-tech-layout';

const Success = () => {
    return (
        <NokorTechLayout>
            {/* <div className="mx-auto my-10 max-w-screen-xl px-4">
                <MyStepper steps={['Cart', 'Checkout', 'Complete']} currentStep={3} />
            </div> */}
            <div className="flex flex-col items-center justify-center p-8 py-20">
                <img src="/assets/icons/check.png" className="size-40" alt="" />
                <h1 className="mt-4 text-3xl font-semibold">Thanks For Order!</h1>
                <p className="mt-2">Your Order Has Been Successfully Placed.</p>
                {/* <p className="mt-2">We Will Get Back To You As Soon As Possible</p> */}

                <Link href="/">
                    <Button className="mt-6">
                        <Undo2Icon />
                        Return To Home Page
                    </Button>
                </Link>
            </div>
        </NokorTechLayout>
    );
};

export default Success;
