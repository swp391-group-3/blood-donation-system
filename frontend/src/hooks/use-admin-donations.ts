import { deserialize, fetchWrapper } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"


export const useAdminDonation = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper("/dashboard/donation-trends");

            return await deserialize(response)
        },
        queryKey: ["/dashboard/donation-trends"]
    })
}