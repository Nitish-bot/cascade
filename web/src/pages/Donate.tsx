import Footer from '@/components/sections/Footer';
import Nav from '@/components/sections/Nav';
import Search from '@/pages/donate/Search';
import Results from '@/pages/donate/Results';
import { useState } from 'react';
import type { Fundraiser } from '@/lib/types';

function Donate() {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);

  return (
    <>
      <Nav />
      <Search />
      <Results fundraisers={fundraisers} setFundraisers={setFundraisers} />
      <Footer />
    </>
  );
}

export default Donate;
