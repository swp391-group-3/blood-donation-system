'use client';

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
import { Save } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { createQuestion } from '@/lib/service/question';
import { ApiError } from '@/lib/service';
import { toast } from 'sonner';

export const CreateQuestionDialog = ({ children }: PropsWithChildren) => {
    const [open, setOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const mutation = useMutation({
        mutationFn: createQuestion,
        onError: (error: ApiError) => toast.error(error.message),
        onSuccess: () => setOpen(false),
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                            onClick={() => setOpen(false)}
                            className="px-6 py-3 text-base border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => mutation.mutate(newQuestion)}
                            disabled={!newQuestion.trim() || mutation.isPending}
                            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-base"
                        >
                            {mutation.isPending ? (
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
