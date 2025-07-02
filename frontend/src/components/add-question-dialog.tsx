import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { PropsWithChildren, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAddQuestion } from '@/hooks/use-add-question';
import { Save } from 'lucide-react';

export const AddQuestionDialog = ({ children }: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const addQuestion = useAddQuestion();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-900">
                        Add New Question
                    </DialogTitle>
                    <p className="text-gray-600 mt-2">
                        Add a new screening question to the donor questionnaire.
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
                            className="min-h-[120px] resize-none text-base border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            This question will be presented to donors during the
                            screening process.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-3 text-base border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => addQuestion.mutate(newQuestion)}
                            disabled={
                                !newQuestion.trim() || addQuestion.isPending
                            }
                            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-base"
                        >
                            {addQuestion.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Adding question ...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5 mr-3" />
                                    Add Question
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
