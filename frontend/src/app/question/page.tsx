'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Droplet,
    Search,
    Filter,
    Heart,
    Droplets,
    User,
    UserSearch,
    FileText,
    Plus,
} from 'lucide-react';
import { Stats, StatsGrid, Props as StatsProps } from '@/components/stats';
import { useBloodRequestList } from '@/hooks/use-blood-request-list';
import { toast } from 'sonner';
import {
    BloodRequest,
    priorities,
    Priority,
} from '@/lib/api/dto/blood-request';
import { useMemo, useState } from 'react';
import { capitalCase } from 'change-case';
import {
    BloodGroup,
    bloodGroups,
    bloodGroupLabels,
} from '@/lib/api/dto/blood-group';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroSummary,
    HeroTitle,
} from '@/components/hero';
import { CardGrid } from '@/components/card-grid';
import { RequestCard } from '@/components/request-card';
import { useQuestionList } from '@/hooks/use-question-list';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

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
                <div className="relative mb-10">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search questions..."
                        className="p-4 pl-11 border-slate-200 focus:border-rose-300 focus:ring-rose-200"
                    />
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
                        <TableBody></TableBody>
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
                            {!search && (
                                <Button
                                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                                >
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
