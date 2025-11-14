const MyNoImage = ({ className, iconWidth }: { className?: string; iconWidth: string }) => {
    return (
        <div className={`flex w-full flex-col items-center justify-center ${className}`}>
            <img width={400} height={400} alt="empty-box" src="/assets/icons/no-image.png" className={iconWidth} />
        </div>
    );
};

export default MyNoImage;
