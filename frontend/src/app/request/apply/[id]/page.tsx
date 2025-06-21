'use client';

import { useApplyRequest } from '@/hooks/use-apply-request';
import { useQuestion } from '@/hooks/use-question';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function RequestApplyPage() {
    const { id } = useParams<{ id: string }>();
    const { data: questions, isPending, error } = useQuestion();
    const mutation = useApplyRequest(id);

    if (isPending) {
        return <div></div>;
    }
    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return <div>{id}</div>;
}
