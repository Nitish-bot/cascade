import { CheckIcon, ChevronsUpDown } from 'lucide-react';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Options = {
  value: string;
  label: string;
};

type Props = {
  placeholder?: string;
  searchPlaceholder?: string;
  options: Options[];
};
export default function ComboboxWithCheckbox({
  placeholder,
  searchPlaceholder,
  options,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedFrameworks, setSelectedFrameworks] = React.useState<Options[]>(
    [],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='noShadow'
          role='combobox'
          aria-expanded={open}
          className='w-fit text-md min-w-[140px] justify-between'
        >
          {selectedFrameworks.length > 0
            ? selectedFrameworks.map((option) => option.label).join(', ')
            : placeholder && placeholder.length > 0
              ? placeholder
              : 'Select options'}
          <ChevronsUpDown className='text-muted-foreground' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0 border-0' align='start'>
        <Command className='**:data-[slot=command-input-wrapper]:h-11'>
          <CommandInput
            placeholder={
              searchPlaceholder && searchPlaceholder.length > 0
                ? searchPlaceholder
                : 'Search option...'
            }
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup className='p-2 [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1'>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setSelectedFrameworks(
                      selectedFrameworks.some((f) => f.value === currentValue)
                        ? selectedFrameworks.filter(
                            (f) => f.value !== currentValue,
                          )
                        : [...selectedFrameworks, option],
                    );
                  }}
                >
                  <div
                    className='border-border pointer-events-none size-5 shrink-0 rounded-base border-2 transition-all select-none *:[svg]:opacity-0 data-[selected=true]:*:[svg]:opacity-100'
                    data-selected={selectedFrameworks.some(
                      (f) => f.value === option.value,
                    )}
                  >
                    <CheckIcon className='size-4 text-current' />
                  </div>
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
