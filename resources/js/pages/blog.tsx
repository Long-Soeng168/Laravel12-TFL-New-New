import { MyBlogSlide } from '@/components/my-blog-slide';
import MyMenu from '@/components/my-menu';
import { MySearch } from '@/components/my-search';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from '@inertiajs/react';
import { AlignRight, Search } from 'lucide-react';

const blog = () => {
    return (
        <div className="mb-10">
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
            <MyBlogSlide />
            {/* End Slide */}
            {/* content */}
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 md:px-20">
                <div className='flex flex-col-reverse lg:flex-row gap-15 mt-10'>
                    {/* Card */}
                    <div className="flex-1 space-y-10">
                        {/*Card 1 */}
                        <div className="overflow-hidden rounded-2xl  bg-white shadow-lg">
                            {/* Image Section */}

                            <div className="relative p-4">
                                <img src="assets/images/imageBlog1.png" alt="Blog Image" className="aspect-video w-full object-cover rounded-md" />
                                <span className="bg-gradient bg-gradient-hover absolute right-8 bottom-8 rounded-full px-3 py-1 text-sm text-white shadow-md">
                                    Application Testing
                                </span>
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900">Open Source Job Report Show More Openings Fewer</h2>

                                {/* Meta Information */}
                                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <img src="assets/images/calendar.png" className="mr-1 h-4 w-4" />
                                        <span>January 10, 2020</span>
                                    </div>
                                    {/* <div className="flex items-center">
                                        <img src="assets/images/user-icon.png" className="mr-1 h-4 w-4" />
                                        <span>admin</span>
                                    </div> */}
                                </div>

                                {/* Description */}
                                <p className="mt-3 text-gray-600">
                                    We denounce with righteous indignation and dislike men who are so beguiled and demo realized by the charms of
                                    pleasure of the moment, so blinded by desire, that...
                                </p>

                                {/* Read More Link */}
                                <div className="mt-4">
                                    <a href="#" className="flex items-center font-semibold text-blue-600 hover:underline">
                                        Continue Reading <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/*end Card 1 */}
                        {/*Card 2 */}
                        <div className="overflow-hidden rounded-2xl  bg-white shadow-lg">
                            {/* Image Section */}

                            <div className="relative p-4">
                                <img src="assets/images/imageBlog2.png" alt="Blog Image" className="aspect-video w-full object-cover rounded-md" />
                                <span className="bg-gradient bg-gradient-hover absolute right-8 bottom-8 rounded-full px-3 py-1 text-sm text-white shadow-md">
                                    Application Testing
                                </span>
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900">Open Source Job Report Show More Openings Fewer</h2>

                                {/* Meta Information */}
                                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <img src="assets/images/calendar.png" className="mr-1 h-4 w-4" />
                                        <span>January 10, 2020</span>
                                    </div>
                                    {/* <div className="flex items-center">
                                        <img src="assets/images/user-icon.png" className="mr-1 h-4 w-4" />
                                        <span>admin</span>
                                    </div> */}
                                </div>

                                {/* Description */}
                                <p className="mt-3 text-gray-600">
                                    We denounce with righteous indignation and dislike men who are so beguiled and demo realized by the charms of
                                    pleasure of the moment, so blinded by desire, that...
                                </p>

                                {/* Read More Link */}
                                <div className="mt-4">
                                    <a href="#" className="flex items-center font-semibold text-blue-600 hover:underline">
                                        Continue Reading <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/*end Card 2 */}
                        {/*Card 2 */}
                        <div className="overflow-hidden rounded-2xl  bg-white shadow-lg">
                            {/* Image Section */}

                            <div className="relative p-4">
                                <img src="assets/images/imageBlog3.png" alt="Blog Image" className="aspect-video w-full object-cover rounded-md" />
                                <span className="bg-gradient bg-gradient-hover absolute right-8 bottom-8 rounded-full px-3 py-1 text-sm text-white shadow-md">
                                    Application Testing
                                </span>
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900">Open Source Job Report Show More Openings Fewer</h2>

                                {/* Meta Information */}
                                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <img src="assets/images/calendar.png" className="mr-1 h-4 w-4" />
                                        <span>January 10, 2020</span>
                                    </div>
                                    {/* <div className="flex items-center">
                                        <img src="assets/images/user-icon.png" className="mr-1 h-4 w-4" />
                                        <span>admin</span>
                                    </div> */}
                                </div>

                                {/* Description */}
                                <p className="mt-3 text-gray-600">
                                    We denounce with righteous indignation and dislike men who are so beguiled and demo realized by the charms of
                                    pleasure of the moment, so blinded by desire, that...
                                </p>

                                {/* Read More Link */}
                                <div className="mt-4">
                                    <a href="#" className="flex items-center font-semibold text-blue-600 hover:underline">
                                        Continue Reading <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/*end Card 2 */}
                    </div>
                    {/*End Card */}
                    {/* Right Contect */}
                    <div className="max-w-full lg:mx-auto lg:max-w-sm space-y-15">
                            {/* Search Box */}
                            <div className="rounded-xl bg-white p-4 shadow-lg">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Searching..."
                                        className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-4 outline-none focus:border-blue-900 focus:ring focus:ring-blue-900"
                                    />
                                    <span className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400"><Search/></span>
                                </div>
                            </div>

                            {/* Latest Posts Section */}
                            <div className="rounded-xl bg-white p-4 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900">Latest Posts</h3>
                                <div className="my-2 w-12 border-b-4 border-blue-900"></div>

                                <div className="space-y-4">
                                    {[
                                        'Pen Source Job Report Show More Openings Fewer',
                                        'Tech Products That Makes Its Easier to Stay at Home',
                                        'Necessity May Give Us Your Best Virtual Court System',
                                        'Servo Project Joins The Linux Foundation Fold Desco',
                                    ].map((post, index) => (

                                        <div key={index} className="flex items-center space-x-3 space-y-3">

                                            <img src="assets/images/imageBlog2.png" alt="Thumbnail" className="h-14 w-14 rounded-lg object-cover" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{post}</p>
                                                <span className="flex items-center text-xs text-gray-500">📅 January 21, 2020</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Categories Section */}
                            <div className="rounded-xl bg-white p-4 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                                <div className="my-2 w-12 border-b-4 border-blue-900"></div>

                                <ul className="space-y-4 text-gray-800">
                                    {[
                                        'Application Testing',
                                        'Artificial Intelligence',
                                        'Digital Technology',
                                        'IT Services',
                                        'Software Development',
                                        'Web Development',
                                    ].map((category, index) => (
                                        <li key={index} className="cursor-pointer border-b border-gray-200 pb-2 last:border-none hover:text-blue-600">
                                            {category}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                    </div>
                    {/*End Right Contect */}
                </div>
            </div>
            {/*End content */}

             {/* Footer */}
             <footer className="bg-gradient-to-b from-blue-100 to-white mt-10 pt-10 pb-5">
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
                            <a href="#" className="text-blue-600 underline underline-offset-4 offset-2">
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
