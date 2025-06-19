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

export const bloogGroupLabels: {
    [key in BloodGroup]: string;
} = {
    o_plus: 'O+',
    o_minus: 'O-',
    a_plus: 'A+',
    a_minus: 'A-',
    b_plus: 'B+',
    b_minus: 'B-',
    a_b_plus: 'AB+',
    a_b_minus: 'AB-',
};
