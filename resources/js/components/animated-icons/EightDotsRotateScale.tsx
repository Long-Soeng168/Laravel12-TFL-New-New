import { cn } from '@/lib/utils';
import './css/EightDotsRotateScale.css'; // import CSS

const EightDotsRotateScale = ({ svgClassName = '' }) => {
    return (
        <div className="rainbow-text-animated">
            <svg fill="currentColor" className={cn('w-[73px] rounded-full', svgClassName)} viewBox="0 0 40 2" xmlns="http://www.w3.org/2000/svg">
                <rect className="moving-rect" width="40" height="2" />
            </svg>
        </div>
    );
};

export default EightDotsRotateScale;
