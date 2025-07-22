import { deserialize, fetchWrapper } from "@/lib/api"
import { BloodGroupDistribution } from "@/lib/dashboard-utils"
import { useQuery } from "@tanstack/react-query"


export const useBloodGroupDistribution = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper("/dashboard/blood-group-distribution")

            return await deserialize<BloodGroupDistribution>(response);
        },
        queryKey: ["/dashboard/blood-group-distribution"]
    })
}