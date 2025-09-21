
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { formSchema2, formInfo2 } from "@/pages/raise/formSchemas";
import formItems from '@/pages/raise/formItems';

import left from '@/assets/left.svg';

type Props = {
  onSubmit: (values: z.infer<typeof formSchema2>) => void,
  onSubmitBack: () => void,
}

function Form2({ onSubmit, onSubmitBack } : Props) {
  const form2 = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      title: '',
      story: '',
      image: undefined,
    },
  });

  return(
    <Form {...form2}>
      <form
        onSubmit={form2.handleSubmit(onSubmit)}
        className='flex flex-col justify-center space-y-8'
      >
        <Card className='text-left p-8 bg-white'>
          <CardHeader>
            <CardTitle className='text-4xl'>Create Fundraiser</CardTitle>
            <CardDescription className='text-lg'>
              Enter some details about the beneficiary first
            </CardDescription>
          </CardHeader>

          <CardContent className='flex flex-col gap-6 mt-16'>
            {formItems(form2, formInfo2)}
          </CardContent>

          <CardFooter className='mt-20 flex justify-between'>
            <Button size='icon' onClick={onSubmitBack}>
              <img src={left} />
            </Button>
            <Button type='submit'>Submit</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default Form2;