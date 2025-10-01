import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import CountriesDropdown from '@/pages/raise/CountriesDropdown';
import DeadlinePicker from '@/pages/raise/DeadlinePicker';
import type { FormInfo } from '@/pages/raise/formSchemas';
import type { UseFormReturn } from 'react-hook-form';

/* eslint-disable @typescript-eslint/no-explicit-any */
function formItems(form: UseFormReturn<any>, formInfo: FormInfo[]) {
  return formInfo.map((info) => (
    <FormField
      key={info.field}
      control={form.control}
      name={info.field}
      render={({ field }) => {
        return (
          <FormItem>
            <FormDescription>{info.description}</FormDescription>
            <FormMessage />
            <FormControl>
              {info.field === 'country' ? (
                <CountriesDropdown field={field} info={info} />
              ) : info.field === 'deadline' ? (
                <DeadlinePicker field={field} />
              ) : info.field === 'story' ? (
                <Textarea placeholder={info.placeholder} {...field} />
              ) : info.field === 'image' ? (
                <Input
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/gif'
                  onChange={(e) => field.onChange(e.target.files)}
                  className='border-0 border-b-1 rounded-none bg-white'
                />
              ) : (
                <Input
                  type={info.field === 'goal' ? 'number' : 'text'}
                  className='border-0 border-b-1 rounded-none bg-white'
                  placeholder={info.placeholder}
                  {...field}
                />
              )}
            </FormControl>
          </FormItem>
        );
      }}
    />
  ));
}

export default formItems;
