import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useEffect, useRef, useState } from 'react';
import MyCkeditor5 from './my-ckeditor5';

export default function Page() {
    const { t, currentLocale } = useTranslation();
    const [data, setData] = useState(sampleData);
    const panelRef = useRef<HTMLDivElement>(null);
    const [panelWidth, setPanelWidth] = useState(0);

    useEffect(() => {
        if (!panelRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setPanelWidth(Math.round(entry.contentRect.width));
        });

        observer.observe(panelRef.current);

        return () => observer.disconnect();
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Sample Content'),
            href: '/admin/ckeditor5',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Tabs defaultValue="editor" className="w-full max-w-full lg:p-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="editor">{t('Editor')}</TabsTrigger>
                    <TabsTrigger value="preview">{t('Preview')}</TabsTrigger>
                </TabsList>

                <div className="mt-2 rounded-md">
                    <TabsContent value="editor" className="z-[100]">
                        <div className="mx-auto flex h-full max-w-6xl items-center justify-center py-2">
                            <MyCkeditor5 data={data} setData={setData} />
                        </div>
                    </TabsContent>

                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={100}>
                            <div ref={panelRef}>
                                <TabsContent value="preview" className="prose ck-content max-w-none">
                                    <div
                                        className={`text-muted-foreground mb-4 text-base ${currentLocale == 'kh' ? 'font-koulen-regular leading-[2]' : 'font-semibold'}`}
                                    >
                                        {t('Viewport width')}: <span className="text-primary font-poppins-regular">{panelWidth} px</span>
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: data }} />
                                </TabsContent>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={0}></ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </Tabs>
        </AppLayout>
    );
}

const sampleData = `<h2 class="document-title" id="ee5902976f4e49a36d08e025ae4a6206a">
    Handheld emperor
</h2>
<p>
    Nintendo, a Japanese electronics company, started as a <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Hanafuda"><i>hanafuda</i> cards</a> manufacturer in 1889. In the mid-1970s, they entered the early video games market and became famous for their home video and handheld game consoles. Nintendo introduced consoles like the <strong>NES</strong>, <strong>SNES</strong>, and <strong>Wii</strong>. But the most revolutionary was for sure the <strong>Game Boy</strong>.
</p>
<h3 class="document-subtitle" id="e4e3f661f4eb7ac23958829a3415654d5">
    A countdown of Nintendo handhelds
</h3>
<figure class="image image_resized" style="width:27.15%;">
    <img src="https://ckeditor.com/docs/ckeditor5/latest/assets/img/game_boy.jpg" width="384" sizes="100vw">
    <figcaption>
        The Nintendo "flagship" - handheld Game Boy
    </figcaption>
</figure>
<ol>
    <li>
        <span style="color:hsl(0,75%,60%);"><strong>Game &amp; Watch</strong></span> was Nintendo's first product offering out-of-home gaming. From 1980 to 1991, over a hundred games were released, gaining great popularity.
    </li>
    <li>
        In 1989, &nbsp;the original <span style="color:hsl(0,75%,60%);"><strong>Game Boy</strong></span> was released. The amazing new machine utilized a cartridge system, allowing the users to play a multitude of games of all kinds. This was <mark class="marker-yellow">a historical game-changer</mark>. &nbsp;
        <ol>
            <li>
                It was followed by a number of versions, such as Game Boy Color or Game Boy Advance.
            </li>
        </ol>
    </li>
    <li>
        In 2004, Nintendo introduced a new console family called the <span style="color:hsl(0,75%,60%);"><strong>Nintendo DS</strong></span>. It sported a dual LCD screen in a folded shell, with the lower one being a touchscreen.
        <ol>
            <li>
                The most prominent development was Nintendo 3DS, which offered a 3D display.
            </li>
        </ol>
    </li>
    <li>
        2017 brought the hybrid experience for both couch-preferring gamers and handheld enthusiasts with the release of the <span style="color:hsl(0,75%,60%);"><strong>Nintendo Switch</strong></span>. It offers both a TV mode with high-definition graphics and a handheld mode using the built-in 6.2" display.&nbsp;
    </li>
</ol>
<h3 class="document-subtitle" id="edabaaf383ba61aeb11c42c4872731db0">
    Handheld consoles' popularity
</h3>
<p>
    While the most recent Switch is a prevalent choice nowadays, the 2DS and 3DS consoles are still popular. The king, however, is none other than the original wonder — the Game Boy.
</p>
<figure class="table">
    <table>
        <thead>
            <tr>
                <th>
                    Console
                </th>
                <th>
                    Production dates
                </th>
                <th>
                    Pieces sold (2021)
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    Game &amp; Watch
                </td>
                <td>
                    1980-1991, 2020-2021
                </td>
                <td>
                    44 million
                </td>
            </tr>
            <tr>
                <td>
                    Game Boy
                </td>
                <td>
                    1989-2010
                </td>
                <td>
                    201 million <sup>1</sup>
                </td>
            </tr>
            <tr>
                <td>
                    Nintendo DS
                </td>
                <td>
                    2011-2020
                </td>
                <td>
                    76 million <sup>2</sup>
                </td>
            </tr>
            <tr>
                <td>
                    Switch
                </td>
                <td>
                    since 2017
                </td>
                <td>
                    140 million <sup>3</sup>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <span style="font-size:10px;">1 - 119 million Game Boy and Game Boy Color variants, 82 million Game Boy Advance variants.</span><br>
                    <span style="font-size:10px;">2 - Including all versions: DS, DSi, 2DS, 3DS, and New 2DS/3DS variants.</span><br>
                    <span style="font-size:10px;">3 - As of early 2024.</span>
                </td>
            </tr>
        </tbody>
    </table>
</figure>
<p>
    Games that can be played on the handheld family include (examples of games listed):
</p>
<ul>
    <li>
        Action &amp; adventure games
        <ul>
            <li>
                The <i>Legend of Zelda</i> series
            </li>
            <li>
                <i>Chrono Trigger</i>
            </li>
        </ul>
    </li>
    <li>
        First-person action games
        <ul>
            <li>
                <i>Splatoon</i>
            </li>
        </ul>
    </li>
    <li>
        Role-playing games (RPG)
        <ul>
            <li>
                The <i>Pokémon</i> series
            </li>
            <li>
                The <i>Final Fantasy</i> series
            </li>
        </ul>
    </li>
</ul>
<h3 data-start="162" data-end="179">
    🔥 <strong data-start="110" data-end="160">High-Performance Laptop — Full Product Details</strong>
</h3>
<h3 data-start="162" data-end="179">
    <strong data-start="166" data-end="179">Overview:</strong>
</h3>
<p data-start="180" data-end="550">
    Experience next-generation computing with our <strong data-start="226" data-end="260">latest high-performance laptop</strong>, engineered to deliver uncompromising speed, stunning visuals, and exceptional multitasking capabilities. Whether you're a gamer, content creator, data analyst, or professional on the go, this laptop is built to handle demanding tasks with ease while maintaining portability and endurance.
</p>
<hr data-start="552" data-end="555">
<h3 data-start="557" data-end="583">
    📊 <strong data-start="564" data-end="583">Specifications:</strong>
</h3>
<ul data-start="585" data-end="1844">
    <li data-start="585" data-end="816">
        <p data-start="587" data-end="816">
            <strong data-start="587" data-end="601">Processor:</strong><br>
            <strong data-start="606" data-end="648">Intel Core i7-13700H (13th Generation)</strong><br>
            14 Cores (6 Performance-cores + 8 Efficient-cores) | 20 Threads | Up to 5.0 GHz Turbo Frequency<br>
            Built for intense workloads, gaming, and seamless multitasking.
        </p>
    </li>
    <li data-start="818" data-end="964">
        <p data-start="820" data-end="964">
            <strong data-start="820" data-end="831">Memory:</strong><br>
            <strong data-start="836" data-end="864">16GB DDR4 RAM (3200 MHz)</strong><br>
            Dual-channel configuration for faster data access and smooth multitasking. Upgradeable to 64GB.
        </p>
    </li>
    <li data-start="966" data-end="1191">
        <p data-start="968" data-end="1191">
            <strong data-start="968" data-end="980">Storage:</strong><br>
            <strong data-start="985" data-end="1007">512GB NVMe M.2 SSD</strong><br>
            Ultra-fast boot times, rapid file transfers, and ample space for your applications, projects, and games. Supports additional storage via extra M.2 or 2.5” SATA bay (if available).
        </p>
    </li>
    <li data-start="1193" data-end="1460">
        <p data-start="1195" data-end="1460">
            <strong data-start="1195" data-end="1208">Graphics:</strong><br>
            <strong data-start="1213" data-end="1257">NVIDIA GeForce RTX 4060 (8GB GDDR6 VRAM)</strong><br>
            Powered by NVIDIA’s Ada Lovelace architecture. Delivers real-time ray tracing, DLSS 3, AI-enhanced graphics, and superior performance in the latest AAA titles and professional creative applications.
        </p>
    </li>
    <li data-start="1462" data-end="1695">
        <p data-start="1464" data-end="1695">
            <strong data-start="1464" data-end="1476">Display:</strong><br>
            <strong data-start="1481" data-end="1539">15.6-inch Full HD (1920 x 1080) IPS Anti-Glare Display</strong><br>
            144Hz refresh rate for ultra-smooth gameplay and scrolling. Wide viewing angles and vibrant color accuracy, ideal for both gaming and content creation.
        </p>
    </li>
    <li data-start="1697" data-end="1844">
        <p data-start="1699" data-end="1844">
            <strong data-start="1699" data-end="1716">Battery Life:</strong><br>
            <strong data-start="1721" data-end="1760">Up to 10 hours (depending on usage)</strong><br>
            Long-lasting battery optimized for portability without sacrificing performance.
        </p>
    </li>
</ul>
<hr data-start="1846" data-end="1849">
<h3 data-start="1851" data-end="1871">
    ⚙️ <strong data-start="1858" data-end="1871">Features:</strong>
</h3>
<ul data-start="1873" data-end="3026">
    <li data-start="1873" data-end="2014">
        <p data-start="1875" data-end="2014">
            <strong data-start="1875" data-end="1903">Advanced Cooling System:</strong><br>
            Dual-fan design with heat pipes and intelligent thermal management to keep the system cool under pressure.
        </p>
    </li>
    <li data-start="2016" data-end="2179">
        <p data-start="2018" data-end="2179">
            <strong data-start="2018" data-end="2039">Backlit Keyboard:</strong><br>
            Full-size RGB backlit keyboard with customizable lighting profiles. Perfect for late-night gaming or working in dimly lit environments.
        </p>
    </li>
    <li data-start="2181" data-end="2573">
        <p data-start="2183" data-end="2202">
            <strong data-start="2183" data-end="2200">Connectivity:</strong>
        </p>
        <ul data-start="2205" data-end="2573">
            <li data-start="2205" data-end="2275">
                <p data-start="2207" data-end="2275">
                    <strong data-start="2207" data-end="2229">Wi-Fi 6 (802.11ax)</strong> — Faster, more stable wireless connections.
                </p>
            </li>
            <li data-start="2278" data-end="2349">
                <p data-start="2280" data-end="2349">
                    <strong data-start="2280" data-end="2297">Bluetooth 5.2</strong> — Reliable peripheral and accessory connectivity.
                </p>
            </li>
            <li data-start="2352" data-end="2573">
                <p data-start="2354" data-end="2366">
                    <strong data-start="2354" data-end="2364">Ports:</strong>
                </p>
                <ul data-start="2371" data-end="2573">
                    <li data-start="2371" data-end="2420">
                        <p data-start="2373" data-end="2420">
                            1 x USB-C with DisplayPort and Power Delivery
                        </p>
                    </li>
                    <li data-start="2425" data-end="2448">
                        <p data-start="2427" data-end="2448">
                            3 x USB-A 3.2 Gen 1
                        </p>
                    </li>
                    <li data-start="2453" data-end="2469">
                        <p data-start="2455" data-end="2469">
                            1 x HDMI 2.1
                        </p>
                    </li>
                    <li data-start="2474" data-end="2496">
                        <p data-start="2476" data-end="2496">
                            1 x RJ-45 Ethernet
                        </p>
                    </li>
                    <li data-start="2501" data-end="2546">
                        <p data-start="2503" data-end="2546">
                            1 x 3.5mm Headphone/Microphone combo jack
                        </p>
                    </li>
                    <li data-start="2551" data-end="2573">
                        <p data-start="2553" data-end="2573">
                            1 x SD Card Reader
                        </p>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
    <li data-start="2575" data-end="2722">
        <p data-start="2577" data-end="2722">
            <strong data-start="2577" data-end="2587">Audio:</strong><br>
            High-definition stereo speakers with DTS:X Ultra support and dual-array microphones for clear conference calls and voice commands.
        </p>
    </li>
    <li data-start="2724" data-end="2858">
        <p data-start="2726" data-end="2858">
            <strong data-start="2726" data-end="2747">Operating System:</strong><br>
            <strong data-start="2752" data-end="2780">Windows 11 Home (64-bit)</strong> — Sleek, modern OS with enhanced gaming, productivity, and security features.
        </p>
    </li>
    <li data-start="2860" data-end="3026">
        <p data-start="2862" data-end="2877">
            <strong data-start="2862" data-end="2875">Security:</strong>
        </p>
        <ul data-start="2880" data-end="3026">
            <li data-start="2880" data-end="2921">
                <p data-start="2882" data-end="2921">
                    <strong data-start="2882" data-end="2904">Fingerprint Reader</strong> (if available)
                </p>
            </li>
            <li data-start="2924" data-end="2950">
                <p data-start="2926" data-end="2950">
                    <strong data-start="2926" data-end="2937">TPM 2.0</strong> encryption
                </p>
            </li>
            <li data-start="2953" data-end="3026">
                <p data-start="2955" data-end="3026">
                    <strong data-start="2955" data-end="2972">Windows Hello</strong> facial recognition (on models with compatible webcam)
                </p>
            </li>
        </ul>
    </li>
</ul>
<hr data-start="3028" data-end="3031">
<h3 data-start="3033" data-end="3064">
    📦 <strong data-start="3040" data-end="3064">Included in the Box:</strong>
</h3>
<ul data-start="3065" data-end="3195">
    <li data-start="3065" data-end="3092">
        <p data-start="3067" data-end="3092">
            High-Performance Laptop
        </p>
    </li>
    <li data-start="3093" data-end="3115">
        <p data-start="3095" data-end="3115">
            230W Power Adapter
        </p>
    </li>
    <li data-start="3116" data-end="3137">
        <p data-start="3118" data-end="3137">
            Quick Start Guide
        </p>
    </li>
    <li data-start="3138" data-end="3195">
        <p data-start="3140" data-end="3195">
            Warranty Card (typically 1-year international warranty)
        </p>
    </li>
</ul>
<hr data-start="3197" data-end="3200">
<h3 data-start="3202" data-end="3223">
    🎮 <strong data-start="3209" data-end="3223">Ideal For:</strong>
</h3>
<ul data-start="3224" data-end="3607">
    <li data-start="3224" data-end="3307">
        <p data-start="3226" data-end="3307">
            <strong data-start="3226" data-end="3237">Gaming:</strong> Smooth, immersive gameplay with RTX ray tracing and high frame rates.
        </p>
    </li>
    <li data-start="3308" data-end="3407">
        <p data-start="3310" data-end="3407">
            <strong data-start="3310" data-end="3331">Content Creation:</strong> Video editing, 3D rendering, and graphic design with NVIDIA Studio drivers.
        </p>
    </li>
    <li data-start="3408" data-end="3490">
        <p data-start="3410" data-end="3490">
            <strong data-start="3410" data-end="3432">Professional Work:</strong> Data analytics, coding, virtualization, and multitasking.
        </p>
    </li>
    <li data-start="3491" data-end="3607">
        <p data-start="3493" data-end="3607">
            <strong data-start="3493" data-end="3523">Streaming &amp; Entertainment:</strong> Full HD display and superior audio make it perfect for Netflix, YouTube, and music.
        </p>
    </li>
</ul>
<hr data-start="3609" data-end="3612">
<h3 data-start="3614" data-end="3647">
    ⚡ <strong data-start="3620" data-end="3647">Why Choose This Laptop?</strong>
</h3>
<p data-start="3648" data-end="4005">
    ✅ Cutting-edge <strong data-start="3663" data-end="3699">13th Gen Intel Core i7 processor</strong><br>
    ✅ Powerful <strong data-start="3713" data-end="3736">NVIDIA RTX 4060 GPU</strong> with AI and ray tracing<br>
    ✅ Fast and spacious <strong data-start="3783" data-end="3801">512GB NVMe SSD</strong><br>
    ✅ Smooth, vibrant <strong data-start="3822" data-end="3843">144Hz IPS display</strong><br>
    ✅ Long-lasting battery for all-day use<br>
    ✅ Modern <strong data-start="3896" data-end="3923">Wi-Fi 6 &amp; Bluetooth 5.2</strong> wireless connectivity<br>
    ✅ Premium features like RGB keyboard and advanced cooling
</p>
`;
