const MyNoDataIcon = () => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center py-4">
            <img width={600} height={600} alt="empty-box" src="/assets/icons/empty.png" className="w-20" />
            <p className="text-foreground text-lg">No Data</p>
        </div>
    );
};

export default MyNoDataIcon;
