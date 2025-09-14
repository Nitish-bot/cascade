import { Card } from "@/components/ui/card";
import Star8 from "../assets/star-8";
import { Button } from "@/components/ui/button";

const contents = [
  {
    "title": "No Middlemen",
    "description": "Funds move directly between supporters and causes - no overseers and approvers.",
    "icon": "💰",
    "highlight": true
  },
  {
    "title": "Transparent by Design",
    "description": "Every contribution is visible on the blockchain, so you always know where money flows.",
    "icon": "👁️",
    "highlight": false
  },
  {
    "title": "Fast & Reliable",
    "description": "Solana's lightning-quick processing ensures support reaches causes in seconds, not days.",
    "icon": "⚡",
    "highlight": false
  },
  {
    "title": "Resistant to Censorship",
    "description": "Campaigns can't be silenced or frozen, giving every cause a fair chance to be heard.",
    "icon": "🛡️",
    "highlight": false
  },
  {
    "title": "Minimal Fees",
    "description": "We only charge a tiny fee to keep the platform running, ensuring that the causes get the most of your support.",
    "icon": "💎",
    "highlight": true
  },
]

const cards = contents.map((content, index) => {
  const grid_number = `box-${index + 1}`;
  const isHighlighted = content.highlight;
  
  return <div 
    key={index}
    style={{gridArea: grid_number}}
    className={`${grid_number} box group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
    
    <Button 
      className={`w-full h-full whitespace-normal p-6 border-2 ${
        isHighlighted 
          ? 'border-border bg-main text-main-foreground shadow-shadow hover:shadow-none' 
          : 'border-border bg-secondary-background text-foreground shadow-shadow hover:shadow-none'
      } transition-all duration-300 group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY`}
      size="freeform"
      variant="noShadow">
      
      <div className="text-left flex flex-col h-full justify-between gap-4 relative z-10">
        <div className="text-4xl mb-2 transform transition-transform duration-300 group-hover:scale-110">
          {content.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-3 leading-tight">
            {content.title}
          </h3>
          <p className={`text-sm leading-relaxed ${
            isHighlighted ? 'text-main-foreground' : 'text-foreground'
          }`}>
            {content.description}
          </p>
        </div>
      </div>
      
      {/* Decorative corner accent */}
      <div className={`absolute top-2 right-2 w-3 h-3 border-2 border-current rounded-full transition-all duration-300 ${
        isHighlighted ? 'bg-main-foreground' : 'bg-main'
      } group-hover:scale-150`}></div>
      
    </Button>
  </div>
});

function Why2() {
    return (
        <section className="why min-h-screen w-full bg-background relative overflow-hidden py-16">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-30"
                 style={{
                     backgroundImage: 
                         'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                     backgroundSize: 'calc(100vw / 10) calc(100vw / 10)',
                     backgroundPosition: 'center'
                 }}>
            </div>
            
            {/* Section header */}
            <div className="relative z-10 text-center mb-16 px-4">
                <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">
                    Why <span className="text-main">CASCADE</span>?
                </h2>
                <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
                    Built for transparency, powered by Solana blockchain
                </p>
            </div>
            
            {/* Cards grid */}
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <div id="features-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[60vh] auto-rows-fr">
                    {cards}
                </div>
            </div>
            
            {/* Decorative elements */}
            <Star8 className="absolute w-24 h-24 top-16 right-8 text-main opacity-20 rotate-12" />
            <Star8 className="absolute w-16 h-16 bottom-16 left-8 text-border opacity-30 -rotate-12" />
        </section>
    )
}

export default Why2;