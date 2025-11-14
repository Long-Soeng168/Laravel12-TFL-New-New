import useTranslation from '@/hooks/use-translation';
import { Head, usePage } from '@inertiajs/react';
import NokorTechLayout from './layouts/nokor-tech-layout';

const About = () => {
    const { about } = usePage().props;
    const { t, currentLocale } = useTranslation();
    return (
        <NokorTechLayout>
            <Head>
                <title>About Us</title>
                <meta
                    name="description"
                    content="Discover the story of PG Online, a fast-growing real estate and digital marketplace company in Cambodia founded by Mr. Samret Sophat. Learn about our vision, mission, and commitment to building trust with customers."
                />
            </Head>
            <div className="text-foreground bg-background">
                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-20">
                    {/* About */}
                    <section>
                        <div>
                            {/* <h1 className="text-foreground text-4xl font-bold">{currentLocale == 'kh' ? privacies.title_kh : privacies.title}</h1> */}
                            <div
                                className="text-foreground prose prose-strong:text-foreground prose-headings:text-foreground max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: currentLocale == 'kh' ? about?.long_description_kh : about?.long_description,
                                }}
                            ></div>
                        </div>
                    </section>
                </main>
            </div>
        </NokorTechLayout>
    );
};

export default About;
