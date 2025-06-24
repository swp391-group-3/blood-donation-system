'use client'
import { useMemo, useState } from 'react';
import { Hero, HeroDescription, HeroKeyword, HeroSummary, HeroTitle } from "@/components/hero"
import { StatsGrid, Stats, Props as StatsProps } from "@/components/stats";
import { BloodBag } from "@/lib/api/dto/blood-bag";
import { Check, CircleX, Package, TriangleAlert } from 'lucide-react';
import { useBloodStorageList } from '@/hooks/use-blood-storage-list';
import { toast } from 'sonner';

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
        
        
        </div>

    )
}