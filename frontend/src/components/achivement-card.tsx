import { Gift} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function AchievementCard({ achievement }: any) {
    const rarityColors = {
        common: "border-gray-200 bg-gray-50",
        rare: "border-blue-200 bg-blue-50",
        epic: "border-green-200 bg-green-50",
        legendary: "border-orange-200 bg-orange-50",
    }
    return (
        <Card
            key={achievement.id}
            className={`transition-all duration-200 hover:shadow-md ${achievement.earned ? rarityColors[achievement.rarity as keyof typeof rarityColors] : "border-gray-200 bg-gray-50 opacity-60"
                }`}
        >
            <CardContent className="p-6">

                <h3 className={`font-semibold mb-2 ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                    {achievement.title}
                </h3>
                <p className={`text-sm mb-4 ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                    {achievement.description}
                </p>

                {!achievement.earned && achievement.progress && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-gray-500">{achievement.progress}%</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                        {achievement.rarity}
                    </Badge>
                    <div className="flex items-center gap-1">
                        <Gift className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-600">{achievement.points} pts</span>
                    </div>
                </div>

                {achievement.earned && achievement.earnedDate && (
                    <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                        Earned {achievement.earnedDate.toLocaleDateString()}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}