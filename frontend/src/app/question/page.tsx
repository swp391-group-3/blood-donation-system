'use client';

import { Input } from '@/components/ui/input';
import { Search, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroTitle,
} from '@/components/hero';
import { useQuestionList } from '@/hooks/use-question-list';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AddQuestionDialog } from '@/components/add-question-dialog';
import { EditQuestionDialog } from '@/components/edit-question-dialog';
import { DeleteQuestionDialog } from '@/components/delete-question-dialog';

export default function QuestionPage() {
    const { data: questions, isPending, error } = useQuestionList();
    const [search, setSearch] = useState<string | undefined>();
    const filtered = useMemo(
        () =>
            questions?.filter(
                (question) => !search || question.content.includes(search),
            ) ?? [],
        [questions, search],
    );

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <Hero>
                <HeroTitle>
                    <HeroKeyword color="emerald">
                        Screening Questions Management
                    </HeroKeyword>
                </HeroTitle>
                <HeroDescription>
                    Manage donor screening questions and questionnaire content
                </HeroDescription>
            </Hero>

            <div className="mx-auto max-w-5xl">
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search questions..."
                            className="p-4 pl-11 border-slate-200 focus:border-rose-300 focus:ring-rose-200"
                        />
                    </div>
                    <AddQuestionDialog>
                        <Button>
                            <Plus className="w-5 h-5 mr-2" />
                            New Question
                        </Button>
                    </AddQuestionDialog>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="p-6 font-semibold text-slate-900">
                                    Question
                                </TableHead>
                                <TableHead className="p-6 font-semibold text-slate-900">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((question, index) => (
                                <TableRow key={question.id}>
                                    <TableCell className="p-6 font-medium text-slate-900 ">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-800 text-sm font-bold shadow-sm border border-purple-200">
                                                {index + 1}
                                            </div>
                                            <div className="text-wrap min-w-0 flex-1">
                                                <div className="font-medium text-slate-900 leading-relaxed">
                                                    {question.content}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex gap-4 mt-4">
                                        <EditQuestionDialog question={question}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit className="h-3 w-3 mr-1" />
                                                Edit
                                            </Button>
                                        </EditQuestionDialog>

                                        <DeleteQuestionDialog
                                            question={question}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-200 text-red-700 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Delete
                                            </Button>
                                        </DeleteQuestionDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                No questions found
                            </h3>
                            <p className="text-slate-600">
                                {search
                                    ? 'No questions match your search.'
                                    : 'Start by creating your first screening question.'}
                            </p>
                            {search && (
                                <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create First Question
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
