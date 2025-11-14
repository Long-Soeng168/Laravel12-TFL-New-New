type SectionHeaderProps = {
    label?: string;
    title: string;
    subtitle?: string;
    dividerColor?: string;
    labelColor?: string;
    titleColor?: string;
    subtitleColor?: string;
};

const SectionHeader = ({
    label,
    title,
    subtitle,
    dividerColor = 'bg-primary',
    labelColor = 'text-muted-foreground',
    titleColor = 'text-foreground',
    subtitleColor = 'text-muted-foreground',
}: SectionHeaderProps) => {
    return (
        <div>
            {label && (
                <p className={`flex items-center justify-center gap-2 text-center ${labelColor}`}>
                    <span className={`h-1 w-6 rounded-full ${dividerColor}`} />
                    {label}
                    <span className={`h-1 w-6 rounded-full ${dividerColor}`} />
                </p>
            )}
            <h1 className={`m-0 mx-auto my-4 max-w-2xl text-center text-4xl font-bold ${titleColor}`}>{title}</h1>
            {subtitle && <p className={`mx-auto max-w-3xl text-center text-lg ${subtitleColor}`}>{subtitle}</p>}
        </div>
    );
};

export default SectionHeader;
