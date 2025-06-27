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

export default function QuestionPage() {
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
        </div>
    );
}
