import { useState } from 'react';
import { parseDate } from 'chrono-node';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { ControllerRenderProps } from 'react-hook-form';

function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

type Props = {
  field: ControllerRenderProps;
};

export default function DeadlinePicker({ field }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('In 2 days');
  const [date, setDate] = useState<Date | undefined>(
    parseDate(value) || undefined,
  );
  const [month, setMonth] = useState<Date | undefined>(date);


  return (
    <div className='flex flex-col gap-3'>
      <div className='relative flex gap-2'>
        <Input
          id='date'
          value={value}
          placeholder='Tomorrow or next week'
          className='bg-white pr-10'
          onChange={(e) => {
            setValue(e.target.value);
            const date = parseDate(e.target.value);
            if (date) {
              setDate(date);
              setMonth(date);
            }
            field.onChange(date);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id='date-picker' variant='neutral' size='icon'>
              <CalendarIcon className='size-3.5' />
              <span className='sr-only'>Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='end'>
            <Calendar
              mode='single'
              selected={date}
              captionLayout='dropdown'
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                setValue(formatDate(date));
                setOpen(false);
                field.onChange(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
