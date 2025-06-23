export interface Health {
    id: string;
    appointment_id: string;
    temperature: number;
    weight: number;
    upper_blood_pressure: number;
    lower_blood_pressure: number;
    heart_rate: number;
    is_good_health: boolean;
    note: string;
    created_at: Date;
}
