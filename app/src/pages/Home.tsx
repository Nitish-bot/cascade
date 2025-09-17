import Nav from '@/components/sections/Nav';
import Hero from '@/components/sections/Hero';
import Why from '@/components/sections/Why';
import How from '@/components/sections/How';
import FAQs from '@/components/sections/FAQs';
import Footer from '@/components/sections/Footer';

function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Why />
      <How />
      {/* <FAQs /> */}
      <Footer />
    </>
  );
}

export default Home;
