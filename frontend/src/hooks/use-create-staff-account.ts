import { fetchWrapper, throwIfError } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"


const schema = z.object({
    email: z.string().email(),
    name: z.string().nonempty({
        message: "Name must not be empty"
    }),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
    phone: z
        .string()
        .regex(/0[\d]{9,9}/, { message: 'Phone must consist of 10 number' }),
})

export const useCreateStaffAccount = (
    opts?: { onSuccess?: () => void }
) => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            console.log(values);

            const response = await fetchWrapper("/account/create-staff", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            await throwIfError(response);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["account"] })
            opts?.onSuccess?.();
            toast.success("Add Staff Account Successfully")
        },
        onError: (error) => {
            if (error.message.includes("phone number")) {
                toast.error("Phone must consist of 10 number")
            }else {
                toast.error(error.message)
            }
        }
    })

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            phone: "",
        }
    })

    return {
        mutation,
        form
    }
}