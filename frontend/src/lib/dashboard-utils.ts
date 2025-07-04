import { Account } from "./api/dto/account";
import { bloodGroupLabels } from "./api/dto/blood-group";
import { BloodRequest } from "./api/dto/blood-request";
import { Donation } from "./api/dto/donation";

const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;


function initTrendData() {
    return Months.map(mon => ({
        month: mon,
        donations: 0,
        requests: 0,
    }))
}

export function getTrendData(donations: Donation[], requests: BloodRequest[]) {
    const trends = initTrendData();

    donations.forEach(d => {
        const idx = new Date(d.created_at).getMonth();
        trends[idx].donations += 1;
    });

    requests.forEach(r => {
        const idx = r.start_time.getMonth();
        trends[idx].requests += 1;

    });

    return trends
}

export interface LabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
}


const bloodGroupColors = [
    { name: "O+", color: "#dc2626" },
    { name: "A+", color: "#ea580c" },
    { name: "B+", color: "#ca8a04" },
    { name: "AB+", color: "#16a34a" },
    { name: "O-", color: "#2563eb" },
    { name: "A-", color: "#7c3aed" },
    { name: "B-", color: "#c2410c" },
    { name: "AB-", color: "#64748b" },
]
function initBloodGroupData() {
    return bloodGroupColors.map(b => ({
        name: b.name,
        value: 0,
        color: b.color
    }))
}

export function getBloodGroupData(accounts: Account[]) {
    const bloodGroupData = initBloodGroupData();
    
    accounts.forEach(account => {
        const bucket = bloodGroupData.find(b => b.name === bloodGroupLabels[account.blood_group]);
        
        if (bucket) {
            bucket.value += 1;
        } 
    });

    return bloodGroupData;
}
