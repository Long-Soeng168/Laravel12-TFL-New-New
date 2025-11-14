import { MyAboutComponent } from '@/components/my-about-component';
import MyBlog from '@/components/my-blog';
import MyMenu from '@/components/my-menu';
import { MyProject } from '@/components/my-project';
import { MySearch } from '@/components/my-search';
import MySlide from '@/components/my-slide';
import { MyTestimonial } from '@/components/my-testimonial';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AlignRight, Search } from 'lucide-react';

const welcome = () => {
    
    return (
        <div>
            <div className="mx-auto mt-5 hidden max-w-screen-2xl px-10 md:px-20 lg:block">
                {/* Header  */}
                <div className="flex items-center justify-between gap-5">
                    <div className="flex-1/2">
                        <img src="assets/images/logo.png" className="w-36"></img>
                    </div>
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
                                    <a href="/" className="offset-2 text-sm font-medium text-white underline underline-offset-4">
                                        Home
                                    </a>
                                    <a
                                        href="#"
                                        className="offset-2 text-sm font-medium text-white underline-offset-4 hover:border-blue-900 hover:underline"
                                    >
                                        About
                                    </a>
                                    <a
                                        href="#"
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

            {/* Slide */}
            <MySlide />
            {/*End Slide */}

            {/* About */}
            <MyAboutComponent />
            {/*End About */}

            {/* Service */}
            <div>
                <div className="bg-blue-100 py-2 sm:py-10 dark:bg-blue-900">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-2 text-center sm:mb-4 dark:text-white">Services</h2>
                        <p className="text-center text-2xl font-bold text-gray-700 sm:text-3xl dark:text-gray-200">Our Best Project</p>
                    </div>
                </div>

                <div className="relative w-full overflow-hidden leading-none dark:bg-gray-800">
                    <svg
                        className="relative block h-[60px] w-[101%] md:h-[150px]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                            className="fill-blue-100 dark:fill-blue-900"
                        ></path>
                    </svg>
                </div>

                <div className="mx-auto max-w-screen-2xl bg-white px-4 sm:px-10 pt-12 sm:pt-11 md:px-20 dark:bg-gray-800">
                    <div className="container mx-auto">
                        <div className="h-full">
                            <div className="grid gap-14 md:grid-cols-2 md:gap-16">
                                {[
                                    {
                                        title: 'Delivery Management System',
                                        src: 'assets/images/delivery.png',
                                        description:
                                            'is a software tool that streamlines the delivery process by managing orders, optimizing routes, and providing real-time tracking.',
                                    },
                                    {
                                        title: 'HR Management System',
                                        src: 'assets/images/hr.png',
                                        description:
                                            'is a software solution that automates and streamlines various human resource functions. It helps manage employee data, recruitment, payroll, performance evaluations, and benefits administration.',
                                    },
                                    {
                                        title: 'Loan Management System',
                                        src: 'assets/images/loan.png',
                                        description:
                                            'is a software solution designed to manage the lifecycle of loans from origination to repayment. It automates processes such as application processing, credit assessment, disbursement, and collections.',
                                    },
                                    {
                                        title: 'School Management System',
                                        src: 'assets/images/education.png',
                                        description:
                                            'is a software solution designed to manage the school, teachers, students, total fee that students will pay for school.',
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="rounded-xl bg-white p-6 text-center shadow hover:shadow-xl">
                                        <div className="bg-gradient mx-auto flex h-20 w-20 -translate-y-16 transform items-center justify-center rounded-full hover:shadow-lg hover:shadow-teal-500/40">
                                            <img src={item.src} alt="icon" className="h-full w-full" />
                                        </div>
                                        <h1 className="text-darken mb-3 text-xl font-medium lg:px-14">{item.title}</h1>
                                        <p className="px-4 text-gray-500">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="mx-auto mt-5 max-w-screen-2xl px-10 md:px-20">
                <div className="text-center">
                    <h1 className="text-sm text-blue-900 uppercase">Services</h1>
                    <p className="mt-4 text-3xl font-bold">Our Best Project</p>
                    <div className="bg-gradient-line mx-auto my-20 h-px w-full max-w-6xl"></div>
                    <div className="bg-gradient-line mx-auto my-20 h-px w-full max-w-6xl"></div>
                    <div className="bg-gradient-line mx-auto my-4 h-px w-full max-w-xl py-1"></div>
                </div>
            </div> */}
            </div>
            {/*End Service */}

            {/* Project */}
            <MyProject />
            {/*My Project */}

            {/* Testmonial */}
            <div>
                <div className="bg-blue-100 py-2 sm:py-10 dark:bg-blue-900">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-2 text-center sm:mb-4 dark:text-white">Testimonial</h2>
                        <p className="text-center text-2xl font-bold text-gray-700 sm:text-3xl dark:text-gray-200">What Saying Our Customers</p>
                    </div>
                </div>

                <div className="relative w-full overflow-hidden leading-none dark:bg-gray-800">
                    <svg
                        className="relative block h-[60px] w-[101%] md:h-[150px]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                            className="fill-blue-100 dark:fill-blue-900"
                        ></path>
                    </svg>
                </div>
                <MyTestimonial />
            </div>
            {/*end Testmonial */}

            {/* Blog */}
            <div className="py-2 sm:py-10">
                <div className="bg-blue-100 py-2 sm:py-10 dark:bg-blue-900">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-2 text-center sm:mb-4 dark:text-white">Blogs</h2>
                        <p className="text-center text-2xl font-bold text-gray-700 sm:text-3xl dark:text-gray-200">Read Our Latest Tips & Tricks</p>
                    </div>
                </div>

                <div className="relative w-full overflow-hidden leading-none dark:bg-gray-800">
                    <svg
                        className="relative block h-[60px] w-[101%] md:h-[150px]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                            className="fill-blue-100 dark:fill-blue-900"
                        ></path>
                    </svg>
                </div>
                <MyBlog />
            </div>
            {/*End Blog */}

            {/* Partner */}
            <div className="bg-gradient">
                <div className="mx-auto max-w-screen-2xl px-10 md:px-20">
                    {/* Scrollable container for small screens */}
                    <div className="scrollbar-hide flex space-x-6 overflow-x-auto sm:flex-nowrap sm:overflow-x-scroll md:grid md:grid-cols-3 lg:grid-cols-5 lg:overflow-x-hidden">
                        <a href="#" className="flex h-32 w-32 flex-shrink-0 items-center justify-center p-2">
                            <img src="assets/images/1.png" alt="Logo 1" />
                        </a>
                        <a href="#" className="flex h-32 w-32 flex-shrink-0 items-center justify-center p-2">
                            <img src="assets/images/2.png" alt="Logo 2" />
                        </a>
                        <a href="#" className="flex h-32 w-32 flex-shrink-0 items-center justify-center p-2">
                            <img src="assets/images/3.png" alt="Logo 3" />
                        </a>
                        <a href="#" className="flex h-32 w-32 flex-shrink-0 items-center justify-center p-2">
                            <img src="assets/images/4.png" alt="Logo 4" />
                        </a>
                        <a href="#" className="flex h-32 w-32 flex-shrink-0 items-center justify-center p-2">
                            <img src="assets/images/5.png" alt="Logo 5" />
                        </a>
                    </div>
                </div>
            </div>

            {/*End Partner */}

            {/* Footer */}
            <footer className="bg-gradient-to-b from-blue-100 to-white pt-10 pb-5">
                <div className="mx-auto max-w-screen-2xl px-5 sm:px-10 md:px-20">
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
                            <a href="#" className="text-blue-600 underline underline-offset-4 offset-2">
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
                            <a href="#" className="hover:text-blue-600">
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

export default welcome;
