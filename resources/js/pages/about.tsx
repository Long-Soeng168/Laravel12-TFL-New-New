import MyMenu from '@/components/my-menu';
import { MySearch } from '@/components/my-search';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from '@inertiajs/react';
import { AlignRight, Search } from 'lucide-react';

const about = () => {
    return (
        <>
            <div className="mx-auto mt-5 hidden max-w-screen-2xl px-10 md:px-20 lg:block">
                {/* Header  */}
                <div className="flex items-center justify-between gap-5">
                    <Link href="/" className="flex-1/2">
                        <img src="assets/images/logo.png" className="w-36"></img>
                    </Link>
                    <div>
                        <div className="grid grid-cols-3 justify-end gap-5">
                            <div className="flex items-center justify-end gap-2">
                                <img src="assets/images/location.png" className="h-7 w-7"></img>
                                <p className="text-sm">
                                    <strong className="text-base">Address</strong> <br /> AP-1151, Aphivath BLV, Dermkor, Chongva, Chroy Changva.
                                    Phnom Penh, Cambodia
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <img src="assets/images/mail.png" className="h-7 w-7"></img>
                                <p className="text-sm">
                                    <strong className="text-base">E-Mail</strong> <br /> Vectorasoft@gmail.com
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <img src="assets/images/call.png" className="h-7 w-7"></img>
                                <p className="text-sm">
                                    <strong className="text-base">Phone</strong> <br /> + 855 12346789
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/*End Header  */}
            </div>
            {/* Navbar */}
            <div className="bg-gradient lg:mt-5">
                <div className="mx-auto flex h-16 max-w-screen-2xl justify-between px-4 sm:px-10 md:px-20">
                    <div className="flex items-center">
                        <MyMenu />
                        <img src="assets/images/logo.png" className="block w-36 lg:hidden" />
                    </div>
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center rounded-md text-sm font-medium text-white focus:ring-2 focus:outline-none"
                                >
                                    <Search size={24} className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top">
                                <MySearch />
                            </SheetContent>
                        </Sheet>
                        <div className="flex items-center gap-5 md:ml-4">
                            <div className="h-4 items-center justify-center border"></div>
                            <div className="hidden gap-2 lg:flex">
                                <a href="#">
                                    <img
                                        className="w-10 rounded-md bg-white px-2 py-2 hover:shadow-2xl hover:transition-all"
                                        src="assets/images/facebook.png"
                                    />
                                </a>
                                <a href="#">
                                    <img
                                        className="w-10 rounded-md bg-white px-2 py-2 hover:shadow-2xl hover:transition-all"
                                        src="assets/images/linkedin.png"
                                    />
                                </a>
                                <a href="#">
                                    <img
                                        className="w-10 rounded-md bg-white px-2 py-2 hover:shadow-2xl hover:transition-all"
                                        src="assets/images/telegram.png"
                                    />
                                </a>
                            </div>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild className="ml-4 flex items-center lg:hidden">
                                <Button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none focus:ring-inset"
                                    aria-expanded="false"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <AlignRight stroke="white" className="h-7 w-7" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-gradient">
                                <h1 className="mt-5 text-center text-xl text-white">Menu</h1>
                                <div className="flex flex-col space-y-8 p-4">
                                    <a href="/" className="offset-2 text-sm font-medium text-white hover:border-blue-900 hover:underline">
                                        Home
                                    </a>
                                    <a href="/about" className="offset-2 border-blue-900 text-sm font-medium text-white underline underline-offset-4">
                                        About
                                    </a>
                                    <a
                                        href="/services"
                                        className="offset-2 text-sm font-medium text-white underline-offset-4 hover:border-blue-900 hover:underline"
                                    >
                                        Services
                                    </a>
                                    <a
                                        href="/blog"
                                        className="offset-2 text-sm font-medium text-white underline-offset-4 hover:border-blue-900 hover:underline"
                                    >
                                        Blogs
                                    </a>
                                    <a
                                        href="/contact"
                                        className="offset-2 text-sm font-medium text-white underline-offset-4 hover:border-blue-900 hover:underline"
                                    >
                                        Contact
                                    </a>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
            {/*End Navbar */}
            <section className="relative pb-0.5 bg-white overflow-hidden text-white">
                <div className="absolute inset-0 bg-white opacity-50"></div>
                <div
                    className="absolute inset-0 aspect-[19/6] bg-cover bg-center"
                    style={{ backgroundImage: "url('assets/images/about.png')" }}
                ></div>

                <div className="relative z-10 mx-auto aspect-[19/6] px-4 md:py-32">
                    <div className="min-h-8">{/* <p className="text-center text-5xl font-bold">About</p> */}</div>
                </div>

                {/* Decorative Element */}
                <div className="absolute right-0 bottom-0 left-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </section>

            {/* Hero section */}
            <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-10 md:px-20">
                <div className="mx-auto flex flex-col items-center justify-between gap-10 px-6 lg:flex-row lg:px-20">
                    {/* Image Section */}
                    <div className="relative flex w-full justify-center lg:w-1/2">
                        <div className="relative aspect-square w-3/4 overflow-hidden rounded-full shadow-2xl sm:w-1/2 md:w-2/3 lg:w-full">
                            <img src="assets/images/image1.png" alt="Teamwork" className="aspect-square w-full rounded-full object-cover" />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-4 -left-6 h-12 w-12 rounded-full bg-blue-300 opacity-50 sm:h-16 sm:w-16"></div>
                        <div className="absolute right-4 -bottom-6 h-12 w-12 rounded-full bg-blue-300 opacity-30 sm:h-16 sm:w-16"></div>
                        <div className="absolute -left-6 h-12 w-12 rounded-full bg-blue-300 opacity-50 sm:h-16 sm:w-16"></div>
                        <div className="absolute right-4 h-12 w-12 rounded-full bg-blue-300 opacity-30 sm:h-16 sm:w-16"></div>
                    </div>
                    {/* Content Section */}
                    <div className="mt-8 w-full text-center lg:mt-0 lg:w-1/2 lg:text-left">
                        <div className="flex items-center justify-center gap-4 lg:justify-start">
                            <hr className="h-2 w-10 bg-blue-900" />
                            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-600 uppercase">About Us</span>
                        </div>
                        <h2 className="mt-8 text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
                            We Are Increasing Business Success With Technology
                        </h2>
                        <p className="mt-6 text-sm text-gray-600 sm:text-base">
                            Over 25 years working in IT services developing software applications and mobile apps for clients all over the world.
                        </p>
                        <p className="mt-4 text-sm text-gray-600 sm:text-base">
                            We denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of
                            the moment.
                        </p>
                        <a
                            href="#"
                            className="bg-gradient bg-gradient-hover mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition-all sm:text-base"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
            {/*End Hero section */}

            {/* Profile team */}
            <div className="mt-16 max-w-screen-2xl px-4 sm:px-10 md:px-20 mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-600 uppercase">Team</span>
                </div>
                <p className="text-center text-2xl font-bold text-gray-700 sm:text-3xl dark:text-gray-200 mt-8">Expert IT Consultants</p>
                <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-4">
                    {/* 1 */}
                    <div className="mt-5 flex flex-col items-center justify-center px-2 py-4 text-center">
                        <img
                            className="inline-flex scale-100 rounded-full border-4 border-[#ffffff] bg-indigo-50 object-cover text-indigo-600 shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-[#002D62] transition-all hover:scale-105 hover:cursor-pointer aspect-square w-52"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyfHxoZWFkc2hvdHxlbnwwfDB8fHwxNjk1ODE3MjEzfDA&ixlib=rb-4.0.3&q=80&w=1080"
                            alt="Profile"
                        />
                        <h1 className="mt-2 text-2xl font-bold text-gray-500">John Doe</h1>
                        <h2 className="text-base font-bold text-gray-500 md:text-xl">
                            Lead Software Engineer @
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-2 border-b-0 font-bold text-indigo-900 transition-all hover:border-b-4 hover:border-b-indigo-300 hover:text-indigo-600"
                            >
                                XYZ
                            </a>
                        </h2>
                        <ul className="mt-2 flex flex-row">
                            {[
                                { href: '#', label: 'GitHub', icon: '/assets/images/facebook.png' },
                                { href: '#', label: 'LinkedIn', icon: '/assets/images/telegram.png' },
                                { href: '#', label: 'Twitter', icon: '/assets/images/mail.png' },
                                { href: '#', label: 'Unsplash', icon: '/assets/images/linkedin.png' },
                            ].map((social, index) => (
                                <li key={index} className="mx-2">
                                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                                        <img src={social.icon} className="h-5 w-5 scale-100 hover:scale-110" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* 1 */}

                    {/* 2 */}
                    <div className="mt-5 flex flex-col items-center justify-center px-2 py-4 text-center">
                        <img
                            className="inline-flex scale-100 rounded-full border-4 border-[#ffffff] bg-indigo-50 object-cover text-indigo-600 shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-[#002D62] transition-all hover:scale-105 hover:cursor-pointer aspect-square w-52"
                            src="/assets/images/girl.png"
                            alt="Profile"
                        />
                        <h1 className="mt-2 text-2xl font-bold text-gray-500">John Doe</h1>
                        <h2 className="text-base font-bold text-gray-500 md:text-xl">
                            Lead Software Engineer @
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-2 border-b-0 font-bold text-indigo-900 transition-all hover:border-b-4 hover:border-b-indigo-300 hover:text-indigo-600"
                            >
                                XYZ
                            </a>
                        </h2>
                        <ul className="mt-2 flex flex-row">
                            {[
                                { href: '#', label: 'GitHub', icon: '/assets/images/facebook.png' },
                                { href: '#', label: 'LinkedIn', icon: '/assets/images/telegram.png' },
                                { href: '#', label: 'Twitter', icon: '/assets/images/mail.png' },
                                { href: '#', label: 'Unsplash', icon: '/assets/images/linkedin.png' },
                            ].map((social, index) => (
                                <li key={index} className="mx-2">
                                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                                        <img src={social.icon} className="h-5 w-5 scale-100 hover:scale-110" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* 2 */}
                    {/* 2 */}
                    <div className="mt-5 flex flex-col items-center justify-center px-2 py-4 text-center">
                    <img
                            className="inline-flex scale-100 rounded-full border-4 border-[#ffffff] bg-indigo-50 object-cover text-indigo-600 shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-[#002D62] transition-all hover:scale-105 hover:cursor-pointer aspect-square w-52"
                            src="/assets/images/image.png"
                            alt="Profile"
                        />
                        <h1 className="mt-2 text-2xl font-bold text-gray-500">John Doe</h1>
                        <h2 className="text-base font-bold text-gray-500 md:text-xl">
                            Lead Software Engineer @
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-2 border-b-0 font-bold text-indigo-900 transition-all hover:border-b-4 hover:border-b-indigo-300 hover:text-indigo-600"
                            >
                                XYZ
                            </a>
                        </h2>
                        <ul className="mt-2 flex flex-row">
                            {[
                                { href: '#', label: 'GitHub', icon: '/assets/images/facebook.png' },
                                { href: '#', label: 'LinkedIn', icon: '/assets/images/telegram.png' },
                                { href: '#', label: 'Twitter', icon: '/assets/images/mail.png' },
                                { href: '#', label: 'Unsplash', icon: '/assets/images/linkedin.png' },
                            ].map((social, index) => (
                                <li key={index} className="mx-2">
                                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                                        <img src={social.icon} className="h-5 w-5 scale-100 hover:scale-110" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* 2 */}
                    {/* 2 */}
                    <div className="mt-5 flex flex-col items-center justify-center px-2 py-4 text-center">
                        <img
                            className="inline-flex scale-100 rounded-full border-4 border-[#ffffff] bg-indigo-50 object-cover text-indigo-600 shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-[#002D62] transition-all hover:scale-105 hover:cursor-pointer aspect-square w-52"
                            src="/assets/images/image3.png"
                            alt="Profile"
                        />
                        <h1 className="mt-2 text-2xl font-bold text-gray-500">John Doe</h1>
                        <h2 className="text-base font-bold text-gray-500 md:text-xl">
                            Lead Software Engineer @
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-2 border-b-0 font-bold text-indigo-900 transition-all hover:border-b-4 hover:border-b-indigo-300 hover:text-indigo-600"
                            >
                                XYZ
                            </a>
                        </h2>
                        <ul className="mt-2 flex flex-row">
                            {[
                                { href: '#', label: 'GitHub', icon: '/assets/images/facebook.png' },
                                { href: '#', label: 'LinkedIn', icon: '/assets/images/telegram.png' },
                                { href: '#', label: 'Twitter', icon: '/assets/images/mail.png' },
                                { href: '#', label: 'Unsplash', icon: '/assets/images/linkedin.png' },
                            ].map((social, index) => (
                                <li key={index} className="mx-2">
                                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                                        <img src={social.icon} className="h-5 w-5 scale-100 hover:scale-110" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* 2 */}
                </div>
            </div>
            {/*End Profile team */}

            {/*  */}
            <section className="py-12 max-w-screen-2xl px-4 sm:px-10 md:px-20 mx-auto">
                {/* Section Header */}
                <div className="mb-8 text-center">
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-600 uppercase">PROCESS</span>
                    <h2 className="text-center text-2xl font-bold text-gray-700 sm:text-3xl dark:text-gray-200 mt-8">Our Working Process</h2>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-4">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center">
                            {/* Outer Dotted Circle */}
                            <div className="relative flex items-center justify-center rounded-full border-2 border-dashed border-indigo-600 p-2">
                                {/* Image */}
                                <img
                                    src={step.img}
                                    alt={step.title}
                                    className="z-4 aspect-square w-52 rounded-full border-4 border-white object-cover shadow-lg"
                                />
                                {/* Small Blue Dots */}
                                <span className="absolute top-5 right-0 h-15 w-15 rounded-full bg-indigo-900"></span>
                                <span className="absolute bottom-5 left-0 h-13 w-13 rounded-full bg-indigo-900"></span>
                            </div>

                            {/* Title */}
                            <h3 className="mt-4 text-lg font-semibold text-gray-800">{step.title}</h3>
                        </div>
                    ))}
                </div>
            </section>
            {/*  */}


             {/* Footer */}
             <footer className="bg-gradient-to-b from-blue-100 to-white pt-10 pb-5">
                <div className="mx-auto max-w-screen-2xl px-5 md:px-10">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                        {/* Logo & Description */}
                        <div>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900">
                                <img src="assets/images/logo.png" alt="Logo" className="mr-2 h-8" />
                            </h2>
                            <p className="mt-3 text-gray-600">
                                Vectorasoft is a leading provider of business and educational software solutions, dedicated to transforming
                                organizations.
                            </p>
                            <div className="mt-4 flex space-x-3">
                                <a href="#" className="rounded-full bg-white p-3 hover:bg-gray-100">
                                    <img src="assets/images/facebook.png" className="h-5 w-5" />
                                </a>
                                <a href="#" className="rounded-full bg-white p-3 hover:bg-gray-100">
                                    <img src="assets/images/linkedin.png" className="h-5 w-5" />
                                </a>
                                <a href="#" className="rounded-full bg-white p-3 hover:bg-gray-100">
                                    <img src="assets/images/telegram.png" className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* IT Services */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">IT Services</h3>
                            <ul className="mt-4 space-y-4 text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-blue-600">
                                        Delivery Management System
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-blue-600">
                                        HR Management System
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-blue-600">
                                        Loan Management System
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-blue-600">
                                        School Management System
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Contact Info</h3>
                            <ul className="mt-4 space-y-4 text-gray-600">
                                <li className="flex items-center gap-3">
                                    <img src="assets/images/location.png" className="h-6 w-6" />
                                    AP-1151, Aphivath BLV, Phnom Penh, Cambodia
                                </li>
                                <li className="flex items-center gap-3">
                                    <img src="assets/images/call.png" className="h-6 w-6" />
                                    012 528 131
                                </li>
                                <li className="flex items-center gap-3">
                                    <img src="assets/images/mail.png" className="h-6 w-6" />
                                    vectorasoft@gmail.com
                                </li>
                                <li className="flex items-center gap-3">
                                    <img src="assets/images/clock.png" className="h-6 w-6" />
                                    8:00 - 5:00 (Opening Hours)
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Newsletter</h3>
                            <p className="mt-3 text-gray-600">Subscribe to get the latest updates.</p>
                            <div className="relative mt-4 flex">
                                <input type="email" placeholder="Your email address" className="w-full rounded-full border bg-white px-4 py-4" />
                                <button className="bg-gradient absolute top-1/2 right-0 -translate-y-1/2 rounded-full px-4 py-4 text-white hover:bg-blue-700">
                                    <img src="assets/images/paper.png" className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-8 flex flex-col items-center justify-between border-t pt-4 text-center text-gray-600 sm:flex-row">
                        <p>&copy; 2025 Vectorasoft | Designed by Vectorasoft</p>
                        <div className="mt-3 flex flex-wrap justify-center space-x-4 sm:mt-0">
                            <a href="/" className="hover:text-blue-600">
                                Home
                            </a>
                            <span>•</span>
                            <a href="#" className="hover:text-blue-600">
                                About
                            </a>
                            <span>•</span>
                            <a href="#" className="hover:text-blue-600">
                                Services
                            </a>
                            <span>•</span>
                            <a href="#" className="offset-2 text-blue-600 underline underline-offset-4">
                                Blogs
                            </a>
                            <span>•</span>
                            <a href="#" className="hover:text-blue-600">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            {/*End Footer */}
        </>
    );
};

export default about;

const steps = [
    { title: 'Discovery', img: '/assets/images/image.png' },
    { title: 'Planning', img: '/assets/images/image1.png' },
    { title: 'Execute', img: '/assets/images/image2.png' },
    { title: 'Deliver', img: '/assets/images/imageBlog1.png' },
];
