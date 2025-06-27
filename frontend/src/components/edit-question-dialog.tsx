import { PropsWithChildren, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Question } from '@/lib/api/dto/question';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useEditQuestion } from '@/hooks/use-edit-question';
import { Save } from 'lucide-react';

export const EditQuestionDialog = ({
    children,
    question,
}: PropsWithChildren<{ question: Question }>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState(question.content);
    const editQuestion = useEditQuestion(question.id);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-900">
                        Edit Question #{question.id}
                    </DialogTitle>
                    <p className="text-gray-600 mt-2">
                        Update the screening question text.
                    </p>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                    <div>
                        <Label className="text-base font-medium text-gray-900 mb-3 block">
                            Question Text
                        </Label>
                        <Textarea
                            placeholder="Enter your screening question here..."
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="min-h-[120px] resize-none text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            This question will be presented to donors during the
                            screening process.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                            className="px-6 py-3 text-base border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => editQuestion.mutate(newQuestion)}
                            disabled={
                                !newQuestion.trim() || editQuestion.isPending
                            }
                            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-base"
                        >
                            {editQuestion.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Saving ...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5 mr-3" />
                                    Save Question
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
