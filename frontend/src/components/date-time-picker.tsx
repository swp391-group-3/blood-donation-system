import { useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';

interface Props {
    date: Date;
    onDateChange: (date: Date) => void;
}

export function DateTimePicker({ date, onDateChange }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker"
                            className="w-32 justify-between font-normal"
                        >
                            {date ? date.toLocaleDateString("en-GB")  : 'Select date'}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(dateOnly) => {
                                if (!dateOnly) return;
                                const newDate = new Date(date);
                                newDate.setFullYear(dateOnly.getFullYear());
                                newDate.setMonth(dateOnly.getMonth());
                                newDate.setDate(dateOnly.getDate());
                                onDateChange(newDate);
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-3">
                <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    defaultValue="10:30:00"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </div>
        </div>
    );
}
