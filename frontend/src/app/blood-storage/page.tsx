'use client'
import { useMemo, useState } from 'react';
import { Hero, HeroDescription, HeroKeyword, HeroSummary, HeroTitle } from "@/components/hero"
import { StatsGrid, Stats, Props as StatsProps } from "@/components/stats";
import { BloodBag } from "@/lib/api/dto/blood-bag";
import { Check, CircleX, Droplet, Filter, Package, Plus, Search, TriangleAlert } from 'lucide-react';
import { useBloodStorageList } from '@/hooks/use-blood-storage-list';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { priorities } from '@/lib/api/dto/blood-request';
import { capitalCase } from 'change-case';
import { bloodGroupLabels, bloodGroups } from '@/lib/api/dto/blood-group';
import { Button } from '@/components/ui/button'
import Link from 'next/link';

const getStats = (bloodInventory: BloodBag[]): StatsProps[] => {
    return [
        {
            label: 'Total Bags',
            value: 5,
            icon: Package,
            description: 'Complete Inventory',
            color: 'blue',
        },
        {
            label: 'Available',
            value: 1,
            icon: Check,
            description: 'Ready for use',
            color: 'green',
        },
        {
            label: 'Expiring Soon',
            value: 0,
            icon: TriangleAlert,
            description: 'Within 7 days',
            color: 'yellow',
        },
        {
            label: 'Expired',
            value: 0,
            icon: CircleX,
            description: 'Requires disposal',
            color: 'rose'
        }
    ]
};

export default function BloodStorage() {
    const { data: bloodBags, isPending, error } = useBloodStorageList();
    const stats = useMemo(
        () => bloodBags ? getStats(bloodBags) : undefined,
        [bloodBags],
    );
    const [search, setSearch] = useState<String | undefined>();

    if(isPending) {
        return <div></div>
    }

    if(error) {
        toast.error('Fail to fetch blood storage data')
        return <div></div>
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <Hero>
                <HeroTitle>
                    Blood Inventory
                    <HeroKeyword color="rose">Requests</HeroKeyword>
                </HeroTitle>
                <HeroDescription>
                    Monitor blood bag inventory and ensure optimal supply management
                </HeroDescription>
            </Hero>
        
            <StatsGrid>
                {stats!.map((entry, index) => (
                    <Stats key={index} {...entry}/>
                ))}
            </StatsGrid>

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search blood bags..."
                            className="pl-11 border-slate-200 focus:border-rose-300 focus:ring-rose-200 rounded-xl"
                        />
                    </div>
                    <Select>
                        <SelectTrigger
                            className="w-fit border-slate-200"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            {priorities.map((priority) => (
                                <SelectItem key={priority} value={priority}>
                                    {capitalCase(priority)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-fit border-slate-200">
                            <Droplet className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Blood Group"/>
                        </SelectTrigger>
                        <SelectContent>
                            {bloodGroups.map((group) => (
                                <SelectItem key={group} value={group}>
                                    {bloodGroupLabels[group]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" asChild>
                        <Link href="/blood-request">
                            <Plus className="w-4 h-4 mr-2"/>
                            Create Blood Request
                        </Link>
                    </Button>
                </div>

            </div>
        </div>

    )
}