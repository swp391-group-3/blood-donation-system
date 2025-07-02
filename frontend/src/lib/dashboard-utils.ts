import { BloodRequest } from "./api/dto/blood-request";
import { Donation } from "./api/dto/donation";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

interface Trend {
    month: keyof typeof MONTHS;
    donations: number;
    requests: number;
}

function initTrendData() {
    return MONTHS.map(mon => ({
        month: mon,
        donations: 0,
        requests: 0,
    }))
}

export function getTrendData(donations: Donation[], requests: BloodRequest[])  {
    const trends = initTrendData();

    donations.forEach(d => {
        const idx = new Date(d.created_at).getMonth();
        trends[idx].donations += d.amount;
    });

    requests.forEach(r => {
        const idx = r.start_time.getMonth(); // r.start_time is a Date
        trends[idx].requests += r.max_people;
    });

    return trends
}