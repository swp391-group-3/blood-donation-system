interface Achievement {
    id: number;
    title: string;
    description: string;
    category: string;
    points: number;
    earned: boolean;
    earnedDate?: Date;
}
interface AchievementCardProps {
    achievement: Achievement;
}

export type { Achievement, AchievementCardProps };
