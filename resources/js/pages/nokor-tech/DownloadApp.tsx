import { Head } from '@inertiajs/react';
import NokorTechLayout from './layouts/nokor-tech-layout';

const DownloadApp = () => {
    return (
        <NokorTechLayout>
            <Head>
                <title>Download PG Market App | Available on App Store & Google Play</title>
                <meta
                    name="description"
                    content="Download the PG Market app today from the App Store or Google Play. Buy and sell products easily through Cambodia’s trusted digital marketplace."
                />
            </Head>
            <div className="my-10">
                <div className="relative mx-auto h-[600px] w-[300px] rounded-[2.5rem] border-[14px] border-gray-800 bg-gray-800 dark:border-gray-800">
                    <div className="flex h-[572px] w-[272px] flex-col overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800">
                        <div className="flex flex-7 items-center">
                            <img src="/assets/icons/smartphone.png" className="p-12" alt="" />
                        </div>
                        <p className="text-center">Download App Now</p>
                        <div className="flex flex-5 flex-col justify-start gap-4 p-4">
                            {/* Google Play Button */}
                            <a
                                href="https://play.google.com/store/apps/details?id=com.longsoeng.pgmarket"
                                className="rainbow-button flex items-center gap-3 rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800"
                            >
                                <img src="/assets/icons/play-store.png" className="size-12" />
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="text-xs">GET IT ON</span>
                                    <span className="text-xl font-semibold">Google Play</span>
                                </div>
                            </a>
                            {/* App Store Button */}
                            <a
                                href="https://apps.apple.com/us/app/pg-market/id6499093044"
                                className="rainbow-button flex items-center gap-3 rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800"
                            >
                                <img src="/assets/icons/app-store.png" className="size-12" />
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="text-xs">Download on the</span>
                                    <span className="text-xl font-semibold">App Store</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </NokorTechLayout>
    );
};

export default DownloadApp;
