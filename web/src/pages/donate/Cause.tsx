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
    <Card className='shadow-0 my-8 sm:my-12' key={id}>
      <CardContent className='flex flex-col sm:flex-row gap-6 sm:gap-12 xl:gap-24 p-4 sm:p-6'>
        {/* ── Image ── */}
        <div className='flex justify-center sm:justify-start sm:self-center flex-shrink-0'>
          {imgUrl ? (
            <img
              src={imgUrl}
              className='h-44 sm:h-40 xl:h-60 w-full sm:w-auto object-cover sm:object-contain rounded-lg'
              alt={title}
            />
          ) : (
            <div className='h-44 sm:h-40 xl:h-60 w-full sm:w-40 xl:w-60 bg-gray-200 rounded-lg' />
          )}
        </div>

        {/* ── Content ── */}
        <div className='flex flex-col justify-between flex-1 min-w-0 text-left sm:text-right'>
          <div className='space-y-2 sm:space-y-3'>
            <CardTitle className='text-lg xl:text-2xl leading-tight tracking-wide break-words'>
              {title}
            </CardTitle>
            <CardDescription className='text-sm sm:text-base xl:text-lg break-words whitespace-pre-wrap overflow-hidden'>
              {truncateDescription(description)}
            </CardDescription>
          </div>

          {/* ── Progress + Donate button ── */}
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-end w-full mt-6'>
            {/* Progress bar sits above on mobile, left of button on sm+ */}
            <div className='flex flex-col items-start sm:items-end gap-1 w-full sm:flex-1'>
              <Progress value={progressPercentage} className='w-full' />
              <span className='text-xs sm:text-sm xl:text-base text-muted-foreground'>
                {completed} SOL of {goal} SOL
              </span>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  id={id}
                  size='default'
                  variant='noShadow'
                  className='w-full sm:w-auto flex-shrink-0'
                >
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
                  {error && <p className='text-sm text-red-500'>{error}</p>}
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
                    className='w-full sm:w-auto'
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
