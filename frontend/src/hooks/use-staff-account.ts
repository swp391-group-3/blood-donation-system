import { fetchWrapper } from "@/lib/api";
import { Staff } from "@/lib/api/dto/account";
import { collectStaffs } from "@/lib/dashboard-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useStaffAccount = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (files: File[]) => {
            const staffs = await collectStaffs(files);
            const results: { staff: Staff; success: boolean; error?: string }[] = [];
            for (const staff of staffs) {
                try {
                    await fetchWrapper('/account/create-staff', {
                        method: 'POST',
                        headers: {
                            Accept: "application/json",
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(staff),
                    });
                    results.push({ staff, success: true });
                } catch (err) {
                    results.push({
                        staff,
                        success: false,
                        error: (err as Error).message,
                    });
                }
            }
            return results;
        },
        onSuccess: (results) => {
            const successCount = results.filter(r => r.success).length;
            const failCount = results.length - successCount;

            qc.invalidateQueries({ queryKey: ['account', 'list-staff'] });

            if (failCount > 0) {
                console.warn('Failed imports:',
                    results.filter(r => !r.success).map(r => ({
                        email: r.staff.email,
                        error: r.error,
                    }))
                );
                toast.info(`${successCount} imported,  ${failCount} failed`);
            } else {
                toast.success(`Imported Staff Successfully`);
            }
        },
        onError: (error) => {
            toast.error("Uploaded file: " + (error as Error).message)
        }
    });
}
