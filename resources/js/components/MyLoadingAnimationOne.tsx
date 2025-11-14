import EightDotsRotateScale from './animated-icons/EightDotsRotateScale';
import ThreeDotsScale from './animated-icons/ThreeDotsScale';

const MyLoadingAnimationOne = () => {
    return (
        <div className="text-primary flex h-full w-full flex-col items-center justify-center px-2">
            <span className="flex items-end font-semibold">
                Loading
                <ThreeDotsScale />
            </span>
            <EightDotsRotateScale />
        </div>
    );
};

export default MyLoadingAnimationOne;
