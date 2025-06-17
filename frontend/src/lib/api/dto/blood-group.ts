export const bloodGroups = [
    'o_plus',
    'o_minus',
    'a_plus',
    'a_minus',
    'b_plus',
    'b_minus',
    'a_b_plus',
    'a_b_minus',
] as const;

export type BloodGroup = (typeof bloodGroups)[number];

export const displayBloodGroup = (bloodGroup: BloodGroup): string => {
    switch (bloodGroup) {
        case 'o_plus':
            return 'O+';
        case 'o_minus':
            return 'O-';
        case 'a_plus':
            return 'A+';
        case 'a_minus':
            return 'A-';
        case 'b_plus':
            return 'B+';
        case 'b_minus':
            return 'B-';
        case 'a_b_plus':
            return 'AB+';
        case 'a_b_minus':
            return 'AB-';
    }
};
