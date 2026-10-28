interface ShippingStepperProps {
    steps: string[];
    current: number;
}

const ShippingStepper = ({ steps, current }: ShippingStepperProps) => (
    <ol className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {steps.map((step, index) => {
            const isActive = index === current;
            const isComplete = index < current;
            return (
                <li key={step} className="flex flex-1 items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${isActive || isComplete
                        ? 'bg-[#1E6BFF] text-white'
                        : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
                        }`}>
                        {index + 1}
                    </span>
                    <span className={`text-sm font-medium ${isActive
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {step}
                    </span>
                    {index < steps.length - 1 && (
                        <span className={`hidden h-px flex-1 sm:block ${isComplete ? 'bg-[#1E6BFF]' : 'bg-gray-200 dark:bg-white/10'}`} />
                    )}
                </li>
            );
        })}
    </ol>
);

export default ShippingStepper;
