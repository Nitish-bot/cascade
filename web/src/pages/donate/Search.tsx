import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ComboboxWithCheckbox from '@/components/ui/combobox';

import search from '@/assets/search.svg';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const categories = [
  {
    value: 'medical',
    label: 'Medical',
  },
  {
    value: 'education',
    label: 'Education',
  },
  {
    value: 'environment',
    label: 'Environment',
  },
  {
    value: 'community',
    label: 'Community',
  },
  {
    value: 'emergency',
    label: 'Emergency',
  },
  {
    value: 'memorial',
    label: 'Memorial',
  },
  {
    value: 'animal',
    label: 'Animal',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

function Search() {
  const formSchema = z.object({
    query: z
      .string()
      .min(3, { message: 'Search query must be at least 3 characters.' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  return (
    <main className='mt-[18vh] sm:mt-[20vh] w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto px-4 sm:px-8 md:px-0'>
      {/* On mobile: stack category filter above the search row.
          On sm+: single row with category | input | button. */}
      <div className='flex flex-col sm:flex-row gap-3 sm:gap-2'>
        {/* Category filter — full width on mobile, fixed width on sm+ */}
        <div className='w-full sm:w-auto'>
          <ComboboxWithCheckbox
            options={categories}
            placeholder='Categories'
            searchPlaceholder='Search categories'
          />
        </div>

        {/* Search input + submit — row on every breakpoint once stacking is resolved */}
        <Form {...form}>
          <form className='flex flex-1 gap-2'>
            <FormField
              key='query'
              control={form.control}
              name='query'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input
                      type='search'
                      placeholder='Search fundraisers'
                      className='w-full'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              size='icon'
              type='submit'
              className='hover:cursor-pointer w-10 h-10 min-w-10 min-h-10 flex-shrink-0'
            >
              <img src={search} className='w-5 h-5' />
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}

export default Search;
