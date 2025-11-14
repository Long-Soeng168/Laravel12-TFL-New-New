import MyMenu from '@/components/my-menu';
import { MySearch } from '@/components/my-search';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from '@inertiajs/react';
import { AlignRight, Search } from 'lucide-react';

const blog = () => {
    return (
        <div>
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
                                    <a href="#" className="offset-2 text-sm font-medium text-white hover:border-blue-900 hover:underline">
                                        Home
                                    </a>
                                    <a href="#" className="offset-2 border-blue-900 text-sm font-medium text-white underline underline-offset-4">
                                        About
                                    </a>
                                    <a
                                        href="#"
                                        className="offset-2 text-sm font-medium text-white underline-offset-4 hover:border-blue-900 hover:underline"
                                    >
                                        Services
                                    </a>
                                    <a
                                        href="#"
                                        className="offset-2 text-sm font-medium text-white underline-offset-4 hover:border-blue-900 hover:underline"
                                    >
                                        Blogs
                                    </a>
                                    <a
                                        href="#"
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
            {/* Slide */}
            <section className="relative pb-0.5 bg-white overflow-hidden text-white">
                <div className="absolute inset-0 bg-white opacity-50"></div>
                <div
                    className="absolute inset-0 aspect-[19/6] bg-cover bg-center"
                    style={{ backgroundImage: "url('assets/images/image copy.png')" }}
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

            {/* End Slide */}
            {/* content */}
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 md:px-20 mt-10">
                <div className="justify-cente flex min-h-screen items-center">
                    <div className="flex flex-col lg:flex-row w-full overflow-hidden">
                        {/* Left Section */}
                        <div className="bg-gradient w-full lg:w-1/3 rounded-md p-8 text-white">
                            <h2 className="mt-2 text-2xl font-bold">Contact Us</h2>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <img src="assets/images/mail.png" className="h-7 w-7" />
                                    <div>
                                        <p className="font-semibold">Email:</p>
                                        <p>vectorasoft@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <img src="assets/images/call.png" className="h-7 w-7" />
                                    <div>
                                        <p className="font-semibold">Phone:</p>
                                        <p>012 528 131</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <img src="assets/images/location (4).png" className="h-7 w-7" />
                                    <div>
                                        <p className="font-semibold">Address:</p>
                                        <p>AP-1151, Aphivath BLV, Dermkor, Chongva, Chroy Changva. Phnom Penh, Cambodia</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="w-full lg:w-2/3 py-8 lg:p-8">
                            <h4 className="text-sm text-blue-900 uppercase">Get in Touch</h4>
                            <h2 className="mt-1 text-2xl font-bold">Fill The Form Below</h2>
                            <form className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Name" className="w-full rounded bg-gray-100 p-3 outline-none" />
                                    <input type="email" placeholder="E-Mail" className="w-full rounded bg-gray-100 p-3 outline-none" />
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="col-span-2 w-full rounded bg-gray-100 p-3 outline-none"
                                    />
                                </div>
                                <textarea placeholder="Your message Here" className="min-h-32 w-full rounded bg-gray-100 p-3 outline-none"></textarea>
                                <button className="bg-gradient rounded-full px-6 py-3 font-semibold text-white">Submit Now</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/*End content */}

            <div className="flex items-center justify-center">
                <div className="w-full rounded-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5909802997454!2d104.922343!3d11.5355045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310950da4db34301%3A0x61232833a62cac36!2sRoyal%20University%20Of%20Law%20And%20Economics!5e0!3m2!1sen!2s!4v1710332324552!5m2!1sen!2s"
                        className="h-[500px] w-full rounded-lg border border-gray-300"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

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
        </div>
    );
};

export default blog;
