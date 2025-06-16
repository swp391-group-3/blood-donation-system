export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Available':
            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'Reserved':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Used':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'Expiring Soon':
            return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'Expired':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'urgent':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'high':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'normal':
            return 'bg-green-100 text-green-800 border-green-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const getDemandColor = (demand: string) => {
    switch (demand) {
        case 'very-high':
            return 'text-red-600';
        case 'high':
            return 'text-orange-600';
        case 'medium':
            return 'text-yellow-600';
        case 'low':
            return 'text-green-600';
        default:
            return 'text-gray-600';
    }
};
