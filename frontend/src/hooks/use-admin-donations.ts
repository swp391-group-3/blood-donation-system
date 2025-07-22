import { deserialize, fetchWrapper } from "@/lib/api"
import { DonationTrend } from "@/lib/dashboard-utils";
import { useQuery } from "@tanstack/react-query"


export const useAdminDonation = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper("/dashboard/donation-trends");

            return await deserialize<DonationTrend[]>(response)
        },
        queryKey: ["/dashboard/donation-trends"]
    })
}