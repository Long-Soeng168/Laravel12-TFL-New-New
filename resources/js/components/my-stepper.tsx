import { CheckCircle, Circle } from 'lucide-react';

interface MyStepperProps {
    steps: string[];
    currentStep: number;
}

const MyStepper: React.FC<MyStepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="mx-auto mb-10 flex w-full items-center gap-4 overflow-auto">
            {steps.map((label, index) => (
                <div key={index} className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
                    {/* Icon */}
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                            index <= currentStep ? 'border-green-500' : 'border-gray-300'
                        } `}
                    >
                        {index < currentStep ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <Circle className={`h-5 w-5 ${index === currentStep ? 'text-green-500' : 'text-gray-400'}`} />
                        )}
                    </div>

                    {/* Label */}
                    <span className={`ml-2 text-base transition-colors duration-300 ${index === currentStep ? 'text-green-600' : 'text-gray-500'}`}>
                        {label}
                    </span>

                    {/* Line */}
                    {index !== steps.length - 1 && (
                        <div className={`mx-2 h-0.5 flex-1 transition-all duration-300 ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyStepper;
