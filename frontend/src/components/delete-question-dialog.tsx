'use client';

import { PropsWithChildren, useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { deleteQuestion, Question } from '@/lib/service/question';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@/lib/service';
import { toast } from 'sonner';

interface Props {
    question: Question;
}

export const DeleteQuestionDialog = ({
    children,
    question,
}: PropsWithChildren<Props>) => {
    const [open, setOpen] = useState(false);
    const mutation = useMutation({
        mutationFn: async () => deleteQuestion(question.id),
        onError: (error: ApiError) => toast.error(error.message),
        onSuccess: () => setOpen(false),
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex justify-end space-x-4 pt-6">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                            }}
                            className="px-6 py-3 text-base border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => mutation.mutate()}
                            className="bg-rose-600 hover:bg-red-700 px-6 py-3 text-base"
                        >
                            {mutation.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Saving ...
                                </>
                            ) : (
                                <>
                                    <Trash className="h-5 w-5 mr-3" />
                                    Delete Question
                                </>
                            )}
                        </Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
