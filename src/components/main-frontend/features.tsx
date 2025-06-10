import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Flag, Coins } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Custom resolver based bets",
      description: "Create your own prediction markets on any topic. From crypto prices to weather forecasts - if you can think it, you can bet on it.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Flag,
      title: "Bet on famous events",
      description: "Bet on sports, politics, entertainment, and major world events. Pre-configured markets with professional odds and instant resolution.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Coins,
      title: "Token rewards",
      description: "Earn platform tokens with every bet you place, regardless of winning or losing. The more you participate, the more you earn.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-20 bg-black" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of decentralized betting with cutting-edge features built on Solana
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <CardHeader className="text-center">
                <div className={`inline-flex w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center text-lg leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
