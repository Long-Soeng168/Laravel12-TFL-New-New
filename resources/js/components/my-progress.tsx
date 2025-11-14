import { Progress } from "./ui/progress";


export function MyProgress() {
    const skills = [
        { name: 'SOFTWARE DEVELOPMENT', percentage: 92 },
        { name: 'WEB DEVELOPMENT', percentage: 80 },
        { name: 'SEO ANALYSIS', percentage: 95 },
        { name: 'CYBER SECURITY', percentage: 78 },
    ];

  return (
    <div className="max-w-2xl mx-auto bg-white ">
        <div className="flex items-center gap-4">
            <hr className="h-2 w-15 bg-blue-900" />
        <h2 className="text-blue-900 uppercase text-sm">About Us</h2>
        </div>

        <h1 className="text-3xl font-bold mt-2">We Are Increasing Business Success With Technology</h1>
        <p className="text-gray-600 mt-3">Over 25 years working in IT services developing software applications and mobile apps for clients all over the world.</p>

        <div className="mt-6 space-y-5">
             {/* Skill Progress Bars */}
             <div className="mt-6 space-y-4">
                        {skills.map((skill, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm font-medium text-gray-800">
                                    <span>{skill.name}</span>
                                    <span>{skill.percentage}%</span>
                                </div>
                                <Progress value={skill.percentage} className="mt-1 h-2 bg-gray-200" />
                            </div>
                        ))}
                    </div>
        </div>

        <div className="mt-6">
            <button className="bg-gradient bg-gradient-hover hover:cursor-pointer text-white px-6 py-2 rounded-full text-lg">Learn More</button>
        </div>
    </div>
  )
}
