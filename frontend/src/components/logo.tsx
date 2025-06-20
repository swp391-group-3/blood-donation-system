import { Heart } from 'lucide-react';

export const Logo = () => {
    return (
        <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:shadow-rose-500/40 transition-all duration-200">
                    <Heart className="h-5 w-5 text-white" />
                </div>
            </div>
            <div className="hidden sm:block">
                <span className="text-xl font-bold text-slate-900">
                    LifeLink
                </span>
                <div className="text-xs text-slate-500 font-medium">
                    Blood Donation Network
                </div>
            </div>
        </div>
    );
};
