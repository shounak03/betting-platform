import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Link your Solana wallet to start betting on our decentralized platform",
      color: "text-purple-400"
    },
    {
      number: "02", 
      title: "Choose or Create",
      description: "Pick from existing markets or create your own custom prediction market",
      color: "text-blue-400"
    },
    {
      number: "03",
      title: "Place Your Bet",
      description: "Stake SOL on your prediction and automatically earn platform tokens",
      color: "text-green-400"
    },
    {
      number: "04",
      title: "Collect Rewards",
      description: "Win big from correct predictions plus bonus tokens for participation",
      color: "text-yellow-400"
    }
  ];

  return (
    <section className="py-20 bg-black" id="how-it-works">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started in minutes with our simple, transparent betting process
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12 lg:mb-18">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-6 p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300 group">
                <div className={`text-6xl font-bold ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* <div className="text-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              Start Your First Bet
            </Button>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
