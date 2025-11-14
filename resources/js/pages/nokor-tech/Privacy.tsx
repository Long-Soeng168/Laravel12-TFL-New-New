import useTranslation from '@/hooks/use-translation';
import { Head, usePage } from '@inertiajs/react';
import NokorTechLayout from './layouts/nokor-tech-layout';

const Privacy = () => {
    const { currentLocale } = useTranslation();
    const { privacies } = usePage().props;
    return (
        <NokorTechLayout>
            <Head>
                <title>Privacy Policy | Your Data Protection Commitment</title>
                <meta
                    name="description"
                    content="Read PG Online's Privacy Policy to understand how we collect, use, and protect your personal information when using our digital marketplace and real estate services."
                />
            </Head>
            <div className="mx-auto max-w-7xl space-y-8 p-8">
                {/* Header */}
                <div>
                    {/* <h1 className="text-foreground text-4xl font-bold">{currentLocale == 'kh' ? privacies.title_kh : privacies.title}</h1> */}
                    <div
                        className="text-foreground prose prose-strong:text-foreground prose-headings:text-foreground max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentLocale == 'kh' ? privacies.long_description_kh : privacies.long_description }}
                    ></div>
                </div>

                {/* <Separator className="my-6" /> */}

                {/* {privacies.children.length && (
                    <main className="space-y-6">
                        {privacies.children?.map((privacy) => (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-foreground text-2xl font-semibold">
                                        {currentLocale == 'kh' ? privacy.title_kh : privacy.title}
                                    </h2>
                                </CardHeader>
                                <CardContent className="text-muted-foreground leading-relaxed">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: currentLocale == 'kh' ? privacy.short_description_kh : privacy.short_description,
                                        }}
                                    ></div>
                                </CardContent>
                            </Card>
                        ))}
                    </main>
                )} */}
            </div>
        </NokorTechLayout>
    );
};

export default Privacy;
