import useTranslation from "@/hooks/use-translation";
import { MyTooltipButton } from "./my-tooltip-button";

const SwitchLanguageAdmin = () => {
    const { currentLocale } = useTranslation();
    return (
        <>
            <div className="flex gap-3">
                <a href="/lang/kh" >
                    <MyTooltipButton className="p-0 hover:bg-transparent" variant="ghost" title="Khmer">
                        <img
                            src="/assets/icons/khmer.png"
                            alt=""
                            className={`aspect-square w-6 rounded-sm object-contain lg:w-7 ${currentLocale == 'kh' && 'ring-primary ring-2 ring-offset-1'}`}
                        />
                    </MyTooltipButton>
                </a>

                <a href="/lang/en" >
                    <MyTooltipButton className="p-0 hover:bg-transparent" variant="ghost" title="English">
                        <img
                            src="/assets/icons/english.png"
                            alt=""
                            className={`aspect-square w-6 rounded-sm object-contain lg:w-7 ${currentLocale == 'en' && 'ring-primary ring-2 ring-offset-1'}`}
                        />
                    </MyTooltipButton>
                </a>
            </div>
        </>
    );
};

export default SwitchLanguageAdmin;
