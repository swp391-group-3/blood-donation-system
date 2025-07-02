import { useDeleteQuestion } from '@/hooks/use-delete-question';
import { Question } from '@/lib/api/dto/question';
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

export const DeleteQuestionDialog = ({
    children,
    question,
}: PropsWithChildren<{ question: Question }>) => {
    const [isOpen, setIsOpen] = useState(false);
    const deleteQuestion = useDeleteQuestion();

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
                                console.log('this');
                                setIsOpen(false);
                            }}
                            className="px-6 py-3 text-base border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => deleteQuestion.mutate(question.id)}
                            className="bg-rose-600 hover:bg-red-700 px-6 py-3 text-base"
                        >
                            {deleteQuestion.isPending ? (
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
