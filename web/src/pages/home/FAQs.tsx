import Star9 from '@/components/assets/star-9';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Star13 from '@/components/assets/star-13';

const faqs = [
  {
    q: 'What is Cascade?',
    a: 'Cascade is a decentralized fundraising platform built on Solana. It allows anyone to raise and support causes directly without banks, middlemen, or censorship.',
  },
  {
    q: 'Are donations refundable?',
    a: "Blockchain transactions on Solana are irreversible. Refunds are only possible if the campaign's creator chooses.",
  },
  {
    q: 'Can I donate anonymously?',
    a: 'Yes. You can donate directly from your Solana wallet without linking personal identity',
  },
  {
    q: 'What fees does Cascade charge?',
    a: 'Cascade charges a 2% platform fee to keep the service running, along with the small network fee (gas) required by Solana for each transaction.',
  },
  {
    q: 'Which cryptocurrencies can I use to donate?',
    a: 'Cascade runs on Solana, so you can donate using SOL and supported Solana Program Library (SPL) tokens like USDC.',
  },
  {
    q: 'Do I need a crypto wallet to start a campaign?',
    a: 'Yes. You will need a Solana-compatible wallet such as Phantom or Solflare to create campaigns and receive funds.',
  },
  {
    q: 'How do I know campaigns are trustworthy?',
    a: 'Every transaction is transparent on-chain. Cascade also supports verification badges, trust scores, and community reporting to help backers identify trustworthy campaigns.',
  },
  {
    q: 'What happens if a campaign does not reach its goal?',
    a: 'Campaign behavior depends on how it is set up. Some campaigns release funds only when the goal is met, while others allow partial funding to be claimed.',
  },
];

const faqItems = faqs.map((faq, index) => {
  const ident = `item-${index + 1}`;
  return (
    <AccordionItem value={ident} key={index} id={ident} className='my-2 '>
      <AccordionTrigger className='accord-trig font-semibold tracking-wide'>
        <span className='mt-1'>{faq.q}</span>
      </AccordionTrigger>
      <AccordionContent className='text-left text-[2rem] text-base'>
        {faq.a}
      </AccordionContent>
    </AccordionItem>
  );
});

function FAQs() {
  return (
    <div className='flex min-h-screen relative'>
      <Star13 className='absolute w-[32vh] right-0 bottom-0 translate-x-1/2 translate-y-1/2' />

      <div className='z-10 flex flex-col self-center w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto '>
        <div className='flex justify-between items-center'>
          <h1 className='text-left text-4xl md:text-6xl font-extrabold text-border mt-4'>
            FAQs
          </h1>
          <Star9 className='h-16' />
        </div>
        <Accordion type='single' className=''>
          {faqItems}
        </Accordion>
      </div>
    </div>
  );
}

export default FAQs;
