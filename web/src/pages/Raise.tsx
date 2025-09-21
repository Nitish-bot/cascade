import { useState } from 'react';
import { z } from 'zod';

import { Progress } from '@/components/ui/progress';

import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import {
  formSchema1,
  formSchema2,
} from '@/pages/raise/formSchemas';
import Form1 from './raise/Form1';
import Form2 from './raise/Form2';

function Raise() {
  function onSubmit1(values: z.infer<typeof formSchema1>) {
    next();
    setProgress(66);
    console.log('Next from step1');
    console.log(values);
  }

  function onSubmit2(values: z.infer<typeof formSchema2>) {
    console.log('Submit from step2');
    console.log(values);
  }

  function onSubmitBack() {
    back();
    setProgress(33);
    console.log('Back from step2');
  }

  const [progress, setProgress] = useState(33);
  const { step, next, back } = useMultiStepForm([
    <Form1 onSubmit={onSubmit1}/>,
    <Form2 onSubmit={onSubmit2} onSubmitBack={onSubmitBack}/>,
  ]);

  return (
    <div className='min-h-screen flex flex-col justify-center py-8 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto'>
      <Progress value={progress} className='w-full mb-6' />
      {step}
    </div>
  );
}

export default Raise;
