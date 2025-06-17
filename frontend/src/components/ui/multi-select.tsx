'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface Option {
    label: string;
    value: string;
}

interface Props {
    placeholder?: string;
    options: Option[];
    selectedValues: string[];
    setSelectedValues: Dispatch<SetStateAction<string[]>>;
}
const MultiSelect = ({
    placeholder,
    options,
    selectedValues,
    setSelectedValues,
}: Props) => {
    const handleSelectChange = (value: string) => {
        if (!selectedValues.includes(value)) {
            setSelectedValues((prev) => [...prev, value]);
        } else {
            const referencedArray = [...selectedValues];
            const indexOfItemToBeRemoved = referencedArray.indexOf(value);
            referencedArray.splice(indexOfItemToBeRemoved, 1);
            setSelectedValues(referencedArray);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="w-full">
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-between"
                    >
                        <div>{placeholder}</div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-56"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    {options.map((option, index: number) => {
                        return (
                            <DropdownMenuCheckboxItem
                                onSelect={(e) => e.preventDefault()}
                                key={index}
                                checked={
                                    selectedValues.indexOf(option.value) !== -1
                                }
                                onCheckedChange={() =>
                                    handleSelectChange(option.value)
                                }
                            >
                                {option.label}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default MultiSelect;
