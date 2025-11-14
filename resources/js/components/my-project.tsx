import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import { MyContentInProject } from './my-content-in-project';

export function MyProject() {
    return (
        <BackgroundBeamsWithCollision className="flex flex-col px-4 sm:px-10 md:px-20">
            <div className="flex flex-col items-center justify-center gap-2 mb-4">
                <h2 className="text-sm text-blue-900 uppercase">Projects</h2>
                <h1 className="text-3xl font-bold max-w-xl text-center">We Are Increasing Business Success With Technology</h1>
            </div>

            <MyContentInProject />
        </BackgroundBeamsWithCollision>
    );
}
