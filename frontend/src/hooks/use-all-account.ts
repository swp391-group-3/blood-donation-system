import { deserialize, fetchWrapper } from "@/lib/api"
import { Account } from "@/lib/api/dto/account";
import { useQuery } from "@tanstack/react-query"


export const useAllAccounts = ()=>{
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper("/account");

            return await deserialize<Account[]>(response);
        },
        queryKey: ['account']
    })
}