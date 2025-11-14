const MyFooter = () => {
    return (
        <>
            <footer className="font-proxima-nova-regular py-10 mt-20 text-black">
                <div className="grid max-w-[2000px] grid-cols-1  mx-auto px-4 lg:px-16 lg:grid-cols-4 gap-8">
                    {/* Contact Section */}
                    <div className="grid grid-cols-1 w-full">
                        <img src="/assets/westec/images/Logo.png" alt="Angkor Wildlife & Aquarium" className="mb-4 w-48" />
                        <div className="text-sm leading-relaxed text-gray-500 md:text-base 2xl:text-xl">
                            <p>
                                No20, St598C, Phum Tomnub Toek,
                                <br />
                                Sangkat Phnom Penh Thmey, Khan Sen Sok,
                                <br />
                                Phnom Penh City, Kingdom of Cambodia.
                            </p>

                            <div className="mt-8">
                                <div className="flex">
                                    <p className="w-28 lg:w-32">Mobile Phone</p>:<p className="ml-2">+855 12 269 661</p>
                                </div>
                                <div className="flex">
                                    <p className="w-28 lg:w-32">Landline Phone</p>:
                                    <p className="ml-2">
                                        +855 16 991 580
                                        <br /> +855 23 882 580
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex">
                                <p className="w-28 lg:w-32">Email</p>:<p className="ml-2">contact@westec.com</p>
                            </div>
                            <div className="mt-8 flex">
                                <p className="w-28 lg:w-32">Office Hours</p>:
                                <p className="ml-2">
                                    8:00AM - 5:00PM <br /> Monday - Saturday
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links Section */}
                    <div className="md:col-span-3 w-full">
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 text-sm text-gray-500">
                            {/* About Us */}
                            <div className="flex-1">
                                <h3 className="inline-block w-full bg-primary px-6 py-1 text-center text-base text-white 2xl:text-2xl">About Us</h3>
                                <ul className="mt-6 list-disc space-y-1 pl-3 2xl:text-xl">
                                    <li>What is Westec?</li>
                                    <li>Mission & Vision</li>
                                    <li>Why Westec</li>
                                    <li>Sales advantages</li>
                                </ul>
                            </div>

                            {/* Solutions */}
                            <div className="flex-1">
                                <h3 className="inline-block w-full bg-primary px-6 py-1 text-center text-base text-white 2xl:text-2xl">Solutions</h3>
                                <ul className="mt-6 list-disc space-y-1 pl-3 2xl:text-xl">
                                    <li>Security & Safety Solutions</li>
                                    <li>Smart Home & Office Solutions</li>
                                    <li>Commercial & Residential Equipments</li>
                                    <li>IT Solutions</li>
                                </ul>
                            </div>
                            {/*Feature Solutions */}
                            <div className="flex-1">
                                <h3 className="inline-block w-full bg-primary px-6 py-1 text-center text-base text-white 2xl:text-2xl">Featured Solutions</h3>
                                <ul className="mt-6 list-disc space-y-1 pl-3 2xl:text-xl">
                                    <li>Security & Safety Solutions</li>
                                    <li>Smart Home & Office Solutions</li>
                                    <li>Commercial & Residential Equipments</li>
                                    <li>IT Solutions</li>
                                </ul>
                            </div>

                            {/* Case Studies */}
                            <div className="flex-1">
                                <h3 className="inline-block w-full bg-primary px-6 py-1 text-center text-base text-white 2xl:text-2xl">Case studies</h3>
                                <ul className="mt-6 list-disc space-y-1 pl-3 2xl:text-xl">
                                    <li>Banking</li>
                                    <li>Embassy</li>
                                    <li>Microfinance</li>
                                    <li>Manufacturing</li>
                                    <li>Construction</li>
                                    <li>Entertainment</li>
                                </ul>
                            </div>
                        </div>

                        {/* Social & Chat Sections */}
                        <div className="mt-16 flex flex-wrap gap-6 w-full">
                            {/* Follow Us */}
                            <div className="w-full sm:flex-1">
                                <h3 className="inline-block bg-primary px-6 py-1 text-base text-white 2xl:text-2xl">Follow Us!</h3>
                                <div className="mt-6 flex gap-2">
                                    {[
                                        { name: 'facebook', alt: 'Facebook' },
                                        { name: 'instagram', alt: 'Instagram' },
                                        { name: 'tiktok', alt: 'TikTok' },
                                        { name: 'youtube', alt: 'YouTube' },
                                        { name: 'linkedin', alt: 'LinkedIn' },
                                    ].map((icon, index) => (
                                        <img
                                            key={index}
                                            src={`/assets/demo-images/${icon.name}.png`}
                                            alt={icon.alt}
                                            className="background size-10 object-contain 2xl:size-14 p-1 transition-all duration-500 hover:scale-125"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Chat With Us */}
                            <div className="flex-1">
                                <h3 className="inline-block bg-primary px-6 py-1 text-base text-white 2xl:text-2xl">Chat With Us!</h3>
                                <div className="mt-6 flex gap-2">
                                    {[
                                        { name: 'talk', alt: 'Talk' },
                                        { name: 'telegram', alt: 'Telegram' },
                                        { name: 'wechat', alt: 'WeChat' },
                                        { name: 'whatsapp', alt: 'WhatsApp' },
                                    ].map((icon, index) => (
                                        <img
                                            key={index}
                                            src={`/assets/demo-images/${icon.name}.png`}
                                            alt={icon.alt}
                                            className="background size-10 object-contain 2xl:size-14 p-1 transition-all duration-500 hover:scale-125"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default MyFooter;
