import Footer from '@/components/sections/Footer';
import Nav from '@/components/sections/Nav';
import Search from '@/pages/donate/Search';
import Results from '@/pages/donate/Results';
import { useState } from 'react';

function Donate() {
  const [fundraisers, setFundraisers] = useState<any[]>([]);

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
