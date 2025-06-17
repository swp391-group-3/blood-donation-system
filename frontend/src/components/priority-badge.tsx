import { Priority } from '@/lib/api/dto/blood-request';
import { Badge } from '@/components/ui/badge';
import { capitalCase } from 'change-case';

export interface Props {
    priority: Priority;
}

const style = (priority: Priority) => {
    switch (priority) {
        case 'low':
            return 'text-green-600';
        case 'medium':
            return 'text-yellow-600';
        case 'high':
            return 'text-rose-600';
    }
};

export const PriorityBadge = ({ priority }: Props) => {
    return <Badge className={style(priority)}>{capitalCase(priority)}</Badge>;
};
