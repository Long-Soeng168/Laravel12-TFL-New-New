<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Blog - Home</title>
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>
    @vite(['resources/css/app.css'])
</head>

<body class="font-sans antialiased bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
    <header class="bg-white dark:bg-gray-800 shadow-md p-4">
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold">My Blog</h1>
            <nav>
                <ul class="flex space-x-4">
                    <li><a href="/" class="text-gray-700 dark:text-gray-300 hover:underline">Home</a></li>
                    <li><a href="#about" class="text-gray-700 dark:text-gray-300 hover:underline">About</a></li>
                    <li><a href="#features" class="text-gray-700 dark:text-gray-300 hover:underline">Features</a></li>
                    <li><a href="#testimonials"
                            class="text-gray-700 dark:text-gray-300 hover:underline">Testimonials</a></li>
                    <li><a href="#contact" class="text-gray-700 dark:text-gray-300 hover:underline">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <main class="container mx-auto mt-6 p-4">
        <section id="hero" class="text-center py-16 bg-blue-500 text-white">
            <h2 class="text-5xl font-bold mb-4">Welcome to My Blog</h2>
            <p class="text-lg">Discover insightful articles on various topics, including technology, lifestyle, and
                more.</p>
        </section>
        <section class="mt-8">
            <h2 class="text-3xl font-bold mb-4">Latest Blogs</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <img src="https://via.placeholder.com/300" alt="Blog Image"
                        class="w-full h-48 object-cover rounded-md mb-3">
                    <h3 class="text-xl font-bold">Blog Post 1</h3>
                    <p class="text-gray-600 dark:text-gray-300">This is a short description of the first blog post...
                    </p>
                    <a href="#" class="text-blue-500 hover:underline">Read more</a>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <img src="https://via.placeholder.com/300" alt="Blog Image"
                        class="w-full h-48 object-cover rounded-md mb-3">
                    <h3 class="text-xl font-bold">Blog Post 2</h3>
                    <p class="text-gray-600 dark:text-gray-300">A brief introduction to the second blog post...</p>
                    <a href="#" class="text-blue-500 hover:underline">Read more</a>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <img src="https://via.placeholder.com/300" alt="Blog Image"
                        class="w-full h-48 object-cover rounded-md mb-3">
                    <h3 class="text-xl font-bold">Blog Post 3</h3>
                    <p class="text-gray-600 dark:text-gray-300">Here is a sneak peek of the third blog post...</p>
                    <a href="#" class="text-blue-500 hover:underline">Read more</a>
                </div>
            </div>
        </section>

        <section id="features" class="mt-8 text-center">
            <h2 class="text-3xl font-bold mb-4">Features</h2>
            <p class="text-gray-600 dark:text-gray-300">Our blog offers engaging and informative content to keep you
                updated.</p>
        </section>

        <section id="testimonials" class="mt-8 bg-gray-200 dark:bg-gray-700 p-6">
            <h2 class="text-3xl font-bold text-center mb-4">Testimonials</h2>
            <div class="flex justify-center space-x-6">
                <blockquote class="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
                    <p class="text-gray-600 dark:text-gray-300">"This blog is a game-changer! The insights are
                        top-notch."</p>
                    <cite class="block mt-2 text-gray-500 dark:text-gray-400">- Jane Doe</cite>
                </blockquote>
                <blockquote class="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
                    <p class="text-gray-600 dark:text-gray-300">"I love reading the latest posts, always something new
                        to learn."</p>
                    <cite class="block mt-2 text-gray-500 dark:text-gray-400">- John Smith</cite>
                </blockquote>
            </div>
        </section>

        <section id="about" class="mt-8 text-center">
            <h2 class="text-3xl font-bold mb-4">About Us</h2>
            <p class="text-gray-600 dark:text-gray-300">We are passionate about sharing knowledge and inspiring people
                through our blog.</p>
        </section>

        <section id="contact" class="mt-8 text-center bg-gray-200 dark:bg-gray-700 p-6">
            <h2 class="text-3xl font-bold mb-4">Contact Us</h2>
            <p class="text-gray-600 dark:text-gray-300">Have questions? Reach out to us!</p>
            <form class="mt-4">
                <input type="text" placeholder="Your Name" class="p-2 border rounded w-full mb-2">
                <input type="email" placeholder="Your Email" class="p-2 border rounded w-full mb-2">
                <textarea placeholder="Your Message" class="p-2 border rounded w-full mb-2"></textarea>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
            </form>
        </section>
    </main>
    <footer class="bg-white dark:bg-gray-800 shadow-md mt-6 p-4 text-center">
        <p class="text-gray-600 dark:text-gray-300">&copy; {{ date('Y') }} My Blog. All rights reserved.</p>
        <p><a href="#" class="text-blue-500 hover:underline">Privacy Policy</a> | <a href="#"
                class="text-blue-500 hover:underline">Terms of Service</a></p>
    </footer>
</body>

</html>
