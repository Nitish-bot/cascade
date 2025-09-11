import hero from '@/assets/hero.svg';

const hero_para = `
Transparent and secure funding for all.
Leverage the solana blockchain technology to raise funds for your causes, 
without intermediaries.
`;

function Hero() {
  return (
  <main className="hero p-4 h-[100vh] w-full overflow-hidden">
      <div className="text-left items-center w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto">
        <div className="flex gap-[16vw] justify-between items-center mx-4 mt-[8vh] py-16">

          <h1 className="text-[2.25rem] md:text-[3.5rem] leading-tight font-extrabold">
            R(A)ISE
            <br />

            <span className="relative inline-block">
              <span className="px-2 py-1 bg-main text-main-foreground" style={{position:'relative', zIndex:1}}>
                TOGETHER
              </span>
            </span>
          </h1>
          <p className="w-[32vw] text-right">{hero_para}</p>
        </div>

        <div className="flex justify-center mt-[6vh] xl:mt-[2vh]">
          <img src={hero} className="w-[64vw] lg:w-[48vw] xl:w-[36vw]"></img>
        </div>
      </div>
    </main>
  )
}

export default Hero