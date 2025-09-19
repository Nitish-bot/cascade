import { useState } from "react";
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import right from '@/assets/right.svg';
import left from '@/assets/left.svg';

import { CountriesDropdown } from "@/lib/CountriesDropdown";
import { DeadlinePicker } from "@/lib/Deadline";
import { useMultiStepForm } from "@/lib/useMultiStepForm";
import { 
  formInfo1,
  formSchema1,
  formInfo2,
  formSchema2,
  type FormInfo,
} from "@/lib/formSchemas";
import { Textarea } from "@/components/ui/textarea";

function Raise() {
  const form2 = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
        title: "",
        story: "",
        image: undefined,
    },
  });

  const form1 = useForm<z.infer<typeof formSchema1>>({
    // any here because taking numeric input is less than ideal
    resolver: zodResolver(formSchema1) as any,
    defaultValues: {
        name: "",
        email: "",
        goal: 22,
        country: "",
        deadline: new Date(),
    },
  });
  
  const formItems = (form: any, formInfo: FormInfo[]) => {
    return formInfo.map(info => <FormField
        key={info.field}
        control={form.control}
        name={info.field}
        render={({ field }) => {
          return <FormItem>
            <FormDescription>{info.description}</FormDescription>
            <FormMessage />
            <FormControl>
              {info.field === "country"
              ? <CountriesDropdown field={field} info={info} />
              : info.field === "deadline"
              ? <DeadlinePicker />
              : info.field === "story"
              ? <Textarea placeholder={info.placeholder} {...field} />
              : info.field === "image"
              ? <Input 
                  type="file" 
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) => field.onChange(e.target.files)}
                  // Don't spread field for file inputs
                  className="border-0 border-b-1 rounded-none bg-white" 
                />
              : <Input 
                  type={info.field === "goal" ? "number" : "text"} 
                  className="border-0 border-b-1 rounded-none bg-white" 
                  placeholder={info.placeholder} 
                  {...field} 
                />
              }
              </FormControl>
          </FormItem>
        }}
      />
    )
  };

  function onSubmit1(values: z.infer<typeof formSchema1>) {
    next();
    setProgress(66);
    console.log("Next from step1");
    console.log(values);
  }

  function onSubmit2(values: z.infer<typeof formSchema2>) {
    console.log("Submit from step2");
    console.log(values);
  }

  const [progress, setProgress] = useState(33);
  const { step, next, back } = useMultiStepForm([
    <Form {...form1}>
      <form onSubmit={form1.handleSubmit(onSubmit1)} className="flex flex-col justify-center space-y-8">
        <Card className="text-left p-8 bg-white">
          <CardHeader>
            <CardTitle className="text-4xl">Create Fundraiser</CardTitle>
            <CardDescription className="text-lg">Enter some details about the beneficiary first</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 mt-16">{formItems(form1, formInfo1)}</CardContent>
          
          <CardFooter className="mt-20 flex justify-end">
              <Button size="icon" type="submit"><img src={right} /></Button>
          </CardFooter>
        </Card>
      </form>
    </Form>,
    
    <Form {...form2}>
      <form onSubmit={form2.handleSubmit(onSubmit2)} className="flex flex-col justify-center space-y-8">
        <Card className="text-left p-8 bg-white">
          <CardHeader>
            <CardTitle className="text-4xl">Create Fundraiser</CardTitle>
            <CardDescription className="text-lg">Enter some details about the beneficiary first</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 mt-16">{formItems(form2, formInfo2)}</CardContent>
          
          <CardFooter className="mt-20 flex justify-between">
              <Button size="icon" onClick={(e) => {
                e.preventDefault();
                setProgress(33);
                back();
                console.log("back from step2");
                console.log()
              }}><img src={left} /></Button>
              <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>,
  ]);

  return (
    <div className="min-h-screen flex flex-col justify-center py-8 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto">
      <Progress value={progress} className="w-full mb-6" />
          {step}
    </div>
  )
}

export default Raise;