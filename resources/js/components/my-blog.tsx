
const MyBlog = () => {
    const image = [
        {
            title: 'Web Development',
            short: 'Tech Products That Makes Its Easier to Stay at Home',
            des: 'We denounce with righteous indige nation and dislike men who are so beguiled...',
            src: 'assets/images/image4.png',
            post:'16 Nov 2020',
            id: 1,
        },
        {
            title: 'It Services',
            short: 'Tech Products That Makes Its Easier to Stay at Home',
            des: 'We denounce with righteous indige nation and dislike men who are so beguiled...',
            src: 'assets/images/imageBlog1.png',
            post:' 20 December 2020',
            id: 2,
        },
        {
            title: 'Artifical Intelligence',
            short: 'Tech Products That Makes Its Easier to Stay at Home',
            des: 'We denounce with righteous indige nation and dislike men who are so beguiled...',
            src: 'assets/images/image2.png',
            post:'20 Nov 2020',
            id: 3,
        },

    ];

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 md:px-20">
            <div className="grid gap-8 p-2 sm:grid-cols-2 lg:grid-cols-3 xl:p-5">
                {image?.map((item)=>(
                    <div key={item.id} className="overflow-hidden rounded-2xl  bg-white shadow-lg">
                    {/* Image Section */}

                    <div className="relative p-4">
                        <img src={item.src} alt="Blog Image" className="aspect-video w-full object-cover rounded-md" />
                        <span className="bg-gradient bg-gradient-hover absolute right-8 bottom-8 rounded-full px-3 py-1 text-sm text-white shadow-md">
                            {item.title}
                        </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900">{item.short}</h2>

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
                        {item.des}
                        </p>

                        {/* Read More Link */}
                        <div className="mt-4">
                            <a href={`/detail/${item.id}`} className="flex items-center font-semibold text-blue-600 hover:underline">
                                Continue Reading <span className="ml-2">→</span>
                            </a>
                        </div>
                    </div>
                </div>

                ))}

            </div>
        </div>
    );
};

export default MyBlog;
