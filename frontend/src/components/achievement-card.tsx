import { Gift } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { AchievementCardProps } from '@/lib/api/dto/achievement';

export function AchievementCard({ achievement }: AchievementCardProps) {
    return (
        <Card
            key={achievement.id}
            className={`transition-all duration-200 hover:shadow-md   }`}
        >
            <CardContent className="p-6">
                <h3
                    className={`font-semibold mb-2 ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}
                >
                    {achievement.title}
                </h3>
                <p
                    className={`text-sm mb-4 ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}
                >
                    {achievement.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Gift className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-600">
                            {achievement.points} pts
                        </span>
                    </div>
                </div>

                {achievement.earned && achievement.earnedDate && (
                    <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                        Earned {achievement.earnedDate.toLocaleDateString()}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
