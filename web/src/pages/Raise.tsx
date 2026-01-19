import { useContext, useState } from 'react';
import { z } from 'zod';

import { Progress } from '@/components/ui/progress';

import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import { formSchema1, formSchema2 } from '@/pages/raise/formSchemas';
import Form1 from '@/pages/raise/Form1';
import Form2 from '@/pages/raise/Form2';
import submitRaiser from '@/pages/raise/formHandler';
import Nav from '@/components/sections/Nav';
import Footer from '@/components/sections/Footer';
import { type FormData } from '@/lib/types';
import { ChainContext } from '@/context/ChainContext';
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { SelectedWalletAccountContext } from '@/context/SelectedWalletAccountContext';
import { connect } from 'solana-kite';
import { redirect } from 'react-router-dom';

function Raise() {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [progress, setProgress] = useState(33);
  
  const [organiser] = useContext(SelectedWalletAccountContext);
  if (organiser === undefined) {
    throw new Error('No organiser wallet selected');
  }

  const { chain, solanaExplorerClusterName } = useContext(ChainContext);
  const account = useWalletAccountTransactionSendingSigner(organiser, chain);
  const connection = connect(solanaExplorerClusterName);

  function onSubmit1(values: z.infer<typeof formSchema1>) {
    setFormData((prev) => ({ ...prev, ...values }));
    next();
    setProgress(67);
    console.log('step 1 form data:', { ...formData, ...values });
  }

  function onSubmit2(values: z.infer<typeof formSchema2>) {
    const completeFormData = { ...formData, ...values } as FormData;
    setProgress(100);
    submitRaiser(connection, account, completeFormData);
    console.log('step 2 form data:', completeFormData);

    redirect('/');
  }

  function onSubmitBack() {
    back();
    setProgress(33);
    console.log('Back from step2');
  }

  const { step, next, back } = useMultiStepForm([
    <Form1 onSubmit={onSubmit1} />,
    <Form2 onSubmit={onSubmit2} onSubmitBack={onSubmitBack} />,
  ]);

  return (
    <>
      <Nav />
      <div className='min-h-screen flex flex-col justify-center py-8 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto'>
        <Progress value={progress} className='w-full mb-6 mt-24' />
        {step}
      </div>
      <Footer />
    </>
  );
}

export default Raise;
