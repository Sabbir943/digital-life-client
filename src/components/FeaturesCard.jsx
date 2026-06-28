
import { FiStar } from 'react-icons/fi';
import Link from 'next/link';

const FeaturesCard =async () => {
    const res= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public-lessons`);
    const lessonData= await res.json();
     const lesson = lessonData.slice(0,6);
    console.log(lesson);
    return (
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-slate-700/80 transition-all group relative">
            {/* Top Star Badge */}
            <span className="absolute top-4 right-4 text-amber-400">
                <FiStar className="fill-amber-400 w-5 h-5" />
            </span>
            
            {/* Card Content */}
            <div className="space-y-3">
                <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-md uppercase">
                    {lesson.category}
                </span>
                <h3 className="text-lg font-bold text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {lesson.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {lesson.description || lesson.content}
                </p>
            </div>

            {/* Card Footer */}
            <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span>By {lesson.creatorName || "Anonymous"}</span>
                <Link href={`/lessons/${lesson._id}`} className="font-bold text-indigo-400 hover:underline">
                    Read Intel →
                </Link>
            </div>
        </div>
    );
};

export default FeaturesCard;