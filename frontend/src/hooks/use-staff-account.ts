import { deserialize, fetchWrapper } from "@/lib/api";
import { Staff } from "@/lib/api/dto/account";
import { useQuery } from "@tanstack/react-query";


export const useStaffAccount = (staff: Staff) => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper("/account/create-staff");

            return await deserialize<Staff[]>(response);
        },
        queryKey: ["account", "create-staff"]
    })

}