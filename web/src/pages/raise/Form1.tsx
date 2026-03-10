import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { formSchema1, formInfo1 } from '@/pages/raise/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import right from '@/assets/right.svg';
import formItems from '@/pages/raise/formItems';

type Props = {
  onSubmit: (values: z.infer<typeof formSchema1>) => void;
};

function Form1({ onSubmit }: Props) {
  const form1 = useForm<z.infer<typeof formSchema1>>({
    resolver: zodResolver(formSchema1),
    defaultValues: {
      name: '',
      email: '',
      goal: '1',
      country: '',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });

  return (
    <Form {...form1}>
      <form
        onSubmit={form1.handleSubmit(onSubmit)}
        className='flex flex-col justify-center space-y-8'
      >
        <Card className='text-left p-4 sm:p-8 bg-white'>
          <CardHeader className='pb-2 sm:pb-4'>
            <CardTitle className='text-2xl sm:text-4xl'>
              Create Fundraiser
            </CardTitle>
            <CardDescription className='text-base sm:text-lg'>
              Enter some details about the beneficiary first
            </CardDescription>
          </CardHeader>

          <CardContent className='flex flex-col gap-5 mt-6 sm:mt-16'>
            {formItems(form1, formInfo1)}
          </CardContent>

          <CardFooter className='mt-8 sm:mt-20 flex justify-end'>
            <Button size='icon' type='submit'>
              <img src={right} />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default Form1;
