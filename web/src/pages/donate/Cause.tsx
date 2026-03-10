import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import donate, { type DonateParams } from './donateHandler';
import { type Address } from '@solana/kit';
import { type Connection } from 'solana-kite';

type CauseProps = {
  id: string;
  title: string;
  description: string;
  goal: number;
  completed: number;
  imgUrl?: string;
  organiserPublicKey: string;
  connection: Connection;
  donor: DonateParams['donor'] | null;
  onDonationComplete?: (newProgress: number) => void;
};

export default function Cause({
  id,
  title,
  description,
  goal,
  completed,
  imgUrl,
  organiserPublicKey,
  connection,
  donor,
  onDonationComplete,
}: CauseProps) {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const truncateDescription = (text: string, wordLimit = 20) => {
    if (!text) return '';
    const segments = text.match(/\S+\s*/g);
    if (!segments) {
      return text.length > 0 && text.length > wordLimit
        ? text.slice(0, wordLimit).trimEnd() + '…'
        : text;
    }

    if (segments.length <= wordLimit) {
      return text;
    }

    const truncated = segments.slice(0, wordLimit).join('');
    return truncated.endsWith('\n')
      ? truncated + '…'
      : truncated.trimEnd() + '…';
  };

  const handleDonate = async () => {
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!donor) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await donate({
        connection,
        donor,
        organiserAddress: organiserPublicKey as Address,
        amount: donationAmount,
        fundraiserId: id,
        currentProgress: completed,
      });

      if (result.success) {
        setIsOpen(false);
        setAmount('');
        onDonationComplete?.(result.newProgress);
      }
    } catch (err) {
      console.error('Donation failed:', err);
      setError(err instanceof Error ? err.message : 'Donation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage =
    goal > 0 ? Math.min((completed / goal) * 100, 100) : 0;
  return (
    <Card className='shadow-0 my-12' key={id}>
      <CardContent className='flex justify-between gap-12 xl:gap-24'>
        <div className='self-center rounded-4xl'>
          {imgUrl ? (
            <img
              src={imgUrl}
              className='h-40 xl:h-60 self-center flex-shrink-0 w-auto object-contain rounded-lg'
              alt={title}
            />
          ) : (
            <div className='h-40 xl:h-60 w-40 xl:w-60 self-center flex-shrink-0 bg-gray-200 rounded-lg' />
          )}
        </div>
        <div className='flex flex-col justify-between text-right flex-1 min-w-0'>
          <div className='space-y-3'>
            <CardTitle className='text-lg xl:text-2xl leading-tight tracking-wide break-words'>
              {title}
            </CardTitle>
            <CardDescription className='text-base xl:text-lg break-words whitespace-pre-wrap overflow-hidden'>
              {truncateDescription(description)}
            </CardDescription>
          </div>
          <div className='flex gap-4 items-center justify-end w-full mt-8'>
            <div className='flex flex-col items-end gap-2 w-full'>
              <Progress value={progressPercentage} className='w-full' />
              <span className='text-sm xl:text-base text-muted-foreground'>
                {completed} SOL of {goal} SOL
              </span>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button id={id} size={'default'} variant={'noShadow'}>
                  Donate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Donate to {title}</DialogTitle>
                  <DialogDescription>
                    Support this cause by making a donation in SOL.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-4 py-4'>
                  <div className='flex items-center gap-4'>
                    <Input
                      id='amount'
                      type='number'
                      placeholder='Amount in SOL'
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min='0.001'
                      step='0.001'
                    />
                  </div>
                  {error && (
                    <p className='text-sm text-red-500'>{error}</p>
                  )}
                  {!donor && (
                    <p className='text-sm text-amber-600'>
                      Please connect your wallet to donate
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleDonate}
                    disabled={isLoading || !donor}
                  >
                    {isLoading ? 'Processing...' : 'Confirm Donation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
