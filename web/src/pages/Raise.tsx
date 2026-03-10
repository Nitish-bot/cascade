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
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line
function RaiseFormContent({ organiserAccount }: { organiserAccount: any }) {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [progress, setProgress] = useState(33);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { chain, solanaExplorerClusterName } = useContext(ChainContext);

  // Now this is safe because the parent ensures organiserAccount is valid
  const account = useWalletAccountTransactionSendingSigner(
    organiserAccount,
    chain,
  );
  const connection = connect(solanaExplorerClusterName);

  function onSubmit1(values: z.infer<typeof formSchema1>) {
    setFormData((prev) => ({ ...prev, ...values }));
    next();
    setProgress(67);
  }

  async function onSubmit2(values: z.infer<typeof formSchema2>) {
    const completeFormData = { ...formData, ...values } as FormData;
    setProgress(100);
    setIsSubmitting(true);

    const result = await submitRaiser(connection, account, completeFormData);
    setIsSubmitting(false);

    if (result?.success) {
      navigate('/donate');
    } else {
      setProgress(67);
    }
  }

  function onSubmitBack() {
    back();
    setProgress(33);
  }

  const { step, next, back } = useMultiStepForm([
    <Form1 onSubmit={onSubmit1} />,
    <Form2 onSubmit={onSubmit2} onSubmitBack={onSubmitBack} />,
  ]);

  if (isSubmitting) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        <p className='mt-4 text-muted-foreground'>Creating your campaign...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col justify-center py-8 px-4 sm:px-6 md:px-0 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto'>
      <Progress value={progress} className='w-full mb-6 mt-20 sm:mt-24' />
      {step}
    </div>
  );
}

// 2. The Main "Guard" Component
function Raise() {
  const [organiser] = useContext(SelectedWalletAccountContext);

  return (
    <>
      <Nav />
      {organiser === undefined ? (
        <div className='min-h-screen flex flex-col items-center justify-center px-4'>
          <p className='text-lg font-semibold mb-4 text-center'>
            Please connect a wallet to create or withdraw from a campaign.
          </p>
        </div>
      ) : (
        <RaiseFormContent organiserAccount={organiser} />
      )}
      <Footer />
    </>
  );
}

export default Raise;
