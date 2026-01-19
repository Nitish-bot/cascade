import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Cause(
  $id: string,
  title: string,
  description: string,
  goal: number,
  completed: number,
  imgUrl?: string,
) {
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

  const progressPercentage =
    goal > 0 ? Math.min((completed / goal) * 100, 100) : 0;
  return (
    <Card className='shadow-0 my-12' key={$id}>
      <CardContent className='flex justify-between gap-12 xl:gap-24'>
        <div className='self-center rounded-4xl'>
          {
          imgUrl ? <img
            src={imgUrl}
            className='h-40 xl:h-60 self-center flex-shrink-0 w-auto object-contain rounded-lg'
            alt={title}
          /> : (<div
            className='h-40 xl:h-60 self-center flex-shrink-0 w-auto object-contain rounded-lg'
          />)
          }
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
            <Button id={$id} size={'default'} variant={'noShadow'}>
              Donate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
