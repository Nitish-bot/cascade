import Nav from '@/components/sections/Nav';
import Footer from '@/components/sections/Footer';

import Hero from '@/pages/home/Hero';
import Why from '@/pages/home/Why';
import How from '@/pages/home/How';
import FAQs from '@/pages/home/FAQs';

function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Why />
      <How />
      <FAQs />
      <Footer />
    </>
  );
}

export default Home;
